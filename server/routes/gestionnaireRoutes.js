const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const jwt = require('jsonwebtoken');
const { Gestionnaire, Etudiant, ChefFiliere, Entreprise, Offre, Stage } = require('../models');  // Import models
const { validateToken } = require('../middlewares/AuthMiddleware');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Route for Gestionnaire login
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    // Find Gestionnaire by email
    const user = await Gestionnaire.findOne({ where: { Email_Gestionnaire: email } });

    // Check if Gestionnaire exists
    if (!user) {
      return res.status(404).json({ error: "Account doesn't exist" });
    }

    // Compare hashed passwords
    if (mot_de_passe !== user.MotDePasse_Gestionnaire) {
      return res.status(401).json({ error: "Wrong username and password combination" });
    }

    // Successful login
    const accessToken = jwt.sign({ Email_Gestionnaire: user.Email_Gestionnaire, ID_Gestionnaire: user.ID_Gestionnaire }, "secret", { expiresIn: '1h' });
    res.json({
      accessToken,
      email: user.Email_Gestionnaire,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Unexpected error during login' });
  }
});


// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add timestamp to filename
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit the file size to 10MB
  fileFilter: (req, file, cb) => {
    // Allow only CSV files
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
    }
  }
});

// Set up multer for CV
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/cvs/'); // Store CVs in a separate folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
  },
});



// -- CSV Upload Routes --

// Upload CSV to create Etudiants (students)
router.post('/upload/students', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log('File uploaded:', req.file); // Log uploaded file information

  const filePath = req.file.path;
  const students = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        console.log('Row data:', row); // Log the data being read from the CSV
        students.push(row); // Push each student to an array to be processed later
      })
      .on('end', async () => {
        console.log('CSV processing finished, students:', students); // Log the final student array

        try {
          const existingEmails = await Etudiant.findAll({
            attributes: ['Email_Etudiant'],
            where: {
              Email_Etudiant: students.map(student => student.Email_Etudiant),
            },
          });

          const existingEmailsSet = new Set(existingEmails.map(e => e.Email_Etudiant));
          const newStudents = students.filter(student => !existingEmailsSet.has(student.Email_Etudiant));

          console.log('New students to be created:', newStudents); // Log the students who are not already in the database

          for (const student of newStudents) {
            console.log('Processing student:', student); // Log each student being processed

            const generateRandomPassword = () => {
              const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let password = '';
              for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return password;
            };

            await Etudiant.create({
              ID_Etudiant: student.ID_Etudiant,
              Nom_Etudiant: student.Nom_Etudiant,
              Prenom_Etudiant: student.Prenom_Etudiant,
              Date_Naissance_Etudiant: student.Date_Naissance_Etudiant,
              Email_Etudiant: student.Email_Etudiant,
              Tel_Etudiant: student.Tel_Etudiant,
              Filiere_Etudiant: student.Filiere_Etudiant,
              Annee_Etudiant: student.Annee_Etudiant,
              MotDePasse_Etudiant: generateRandomPassword(), // Generate a random password here
            });
          }

          fs.unlinkSync(filePath); // Clean up the uploaded file
          console.log('File deleted after processing.');

          res.status(201).json({ message: 'Students created successfully!' });
        } catch (error) {
          console.error('Error processing students:', error); // Log any errors in processing the students
          fs.unlinkSync(filePath); // Clean up the uploaded file in case of error
          res.status(500).json({ error: 'Failed to create students from CSV' });
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error); // Log errors in reading the CSV file
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Upload CSV to create ChefDeFiliere
router.post('/upload/chefs', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const chefs = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        chefs.push(row);
      })
      .on('end', async () => {
        try {
          // Retrieve existing emails from the database
          const existingEmails = await ChefFiliere.findAll({
            attributes: ['Email_CDF'],
            where: {
              Email_CDF: chefs.map(chef => chef.Email_CDF),
            },
          });

          // Create a set of existing emails for quick lookup
          const existingEmailsSet = new Set(existingEmails.map(e => e.Email_CDF));

          // Filter the chefs list to include only new entries
          const newChefs = chefs.filter(chef => !existingEmailsSet.has(chef.Email_CDF));

          console.log('New chefs to be created:', newChefs); // Log new chefs

          // Create new chefs
          for (const chef of newChefs) {
            const generateRandomPassword = () => {
              const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let password = '';
              for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return password;
            };

            await ChefFiliere.create({
              ID_CDF: chef.ID_CDF,
              Nom_CDF: chef.Nom_CDF,
              Prenom_CDF: chef.Prenom_CDF,
              Email_CDF: chef.Email_CDF,
              Tel_CDF: chef.Tel_CDF,
              FiliereAssociee_CDF: chef.FiliereAssociee_CDF,
              MotDePasse_CDF: generateRandomPassword(),
            });
          }

          fs.unlinkSync(filePath); // Clean up the uploaded file
          res.status(201).json({ message: 'ChefDeFilieres created successfully!' });
        } catch (error) {
          console.error('Error processing chefs:', error);
          fs.unlinkSync(filePath);
          res.status(500).json({ error: 'Failed to create ChefDeFiliere from CSV' });
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});


// Upload CSV to create Entreprises
router.post('/upload/entreprises', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const entreprises = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        entreprises.push(row);
      })
      .on('end', async () => {
        try {
          // Retrieve existing emails from the database
          const existingEmails = await Entreprise.findAll({
            attributes: ['Email_Entreprise'],
            where: {
              Email_Entreprise: entreprises.map(entreprise => entreprise.Email_Entreprise),
            },
          });

          // Create a set of existing emails for quick lookup
          const existingEmailsSet = new Set(existingEmails.map(e => e.Email_Entreprise));

          // Filter the entreprises list to include only new entries
          const newEntreprises = entreprises.filter(entreprise => !existingEmailsSet.has(entreprise.Email_Entreprise));

          console.log('New entreprises to be created:', newEntreprises); // Log new entreprises

          // Create new entreprises
          for (const entreprise of newEntreprises) {
            const generateRandomPassword = () => {
              const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let password = '';
              for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return password;
            };

            await Entreprise.create({
              Nom_Entreprise: entreprise.Nom_Entreprise,
              Adresse_Entreprise: entreprise.Adresse_Entreprise,
              Tel_Entreprise: entreprise.Tel_Entreprise,
              Email_Entreprise: entreprise.Email_Entreprise,
              MotDePasse_Entreprise: generateRandomPassword(), // Generate random password
            });
          }

          fs.unlinkSync(filePath); // Clean up the uploaded file
          res.status(201).json({ message: 'Entreprises created successfully!' });
        } catch (error) {
          console.error('Error processing entreprises:', error);
          fs.unlinkSync(filePath);
          res.status(500).json({ error: 'Failed to create Entreprise from CSV' });
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});




// -- Update Routes --

// Modify Student
router.put('/student/:id', async (req, res) => {
  const studentId = req.params.id;  // studentId is now a string
  const {
    ID_Etudiant,
    Nom_Etudiant,
    Prenom_Etudiant,
    Date_Naissance_Etudiant,
    Email_Etudiant,
    Tel_Etudiant,
    Filiere_Etudiant,
    Annee_Etudiant,
    Statut_Recherche,
    MotDePasse_Etudiant,
  } = req.body;

  try {
    // Use findOne to find the student by the string-based ID
    const student = await Etudiant.findOne({ where: { ID_Etudiant: studentId } });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the student data
    await student.update({
      ID_Etudiant,
      Nom_Etudiant,
      Prenom_Etudiant,
      Date_Naissance_Etudiant,
      Email_Etudiant,
      Tel_Etudiant,
      Filiere_Etudiant,
      Annee_Etudiant,
      Statut_Recherche,
      MotDePasse_Etudiant,
    });

    return res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ message: 'Error updating student' });
  }
});

// Modify ChefFiliere
router.put('/chefFiliere/:id', async (req, res) => {
  const chefFiliereId = req.params.id;  // chefFiliereId is now a string
  const {
    ID_CDF,
    Nom_CDF,
    Prenom_CDF,
    Email_CDF,
    Tel_CDF,
    FiliereAssociee_CDF,
    MotDePasse_CDF,
  } = req.body;

  try {
    // Use findOne to find the ChefFiliere by the string-based ID
    const chefFiliere = await ChefFiliere.findOne({ where: { ID_CDF: chefFiliereId } });

    if (!chefFiliere) {
      return res.status(404).json({ message: 'Chef de Filière not found' });
    }

    // Update the chefFiliere data
    await chefFiliere.update({
      ID_CDF,
      Nom_CDF,
      Prenom_CDF,
      Email_CDF,
      Tel_CDF,
      FiliereAssociee_CDF,
      MotDePasse_CDF,
    });

    return res.status(200).json({ message: 'Chef de Filière updated successfully' });
  } catch (error) {
    console.error('Error updating Chef de Filière:', error);
    return res.status(500).json({ message: 'Error updating Chef de Filière' });
  }
});


// Modify Entreprise
router.put('/entreprise/:id', async (req, res) => {
  const entrepriseId = req.params.id;
  const {
    Nom_Entreprise,
    Adresse_Entreprise,
    Tel_Entreprise,
    Email_Entreprise,
    MotDePasse_Entreprise,
  } = req.body;

  try {
    const entreprise = await Entreprise.findByPk(entrepriseId);

    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise not found' });
    }

    // Update the entreprise data
    await entreprise.update({
      Nom_Entreprise,
      Adresse_Entreprise,
      Tel_Entreprise,
      Email_Entreprise,
      MotDePasse_Entreprise,
    });

    return res.status(200).json({ message: 'Entreprise updated successfully' });
  } catch (error) {
    console.error('Error updating entreprise:', error);
    return res.status(500).json({ message: 'Error updating entreprise' });
  }
});



// -- Delete Routes --
// Delete Student
router.delete('/student/:id', async (req, res) => {
  const studentId = req.params.id;  // studentId is now a string

  try {
    // Use findOne to find the student by string-based ID
    const student = await Etudiant.findOne({
      where: { ID_Etudiant: studentId }, // Adjusted to use string ID
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the student from the database
    await student.destroy();

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ message: 'Error deleting student' });
  }
});

// Delete ChefFiliere
router.delete('/chefFiliere/:id', async (req, res) => {
  const chefFiliereId = req.params.id;  // chefFiliereId is a string now

  try {
    // Use findOne to find the ChefFiliere by string-based ID
    const chefFiliere = await ChefFiliere.findOne({
      where: { ID_CDF: chefFiliereId },  // Adjusted to use string ID
    });

    if (!chefFiliere) {
      return res.status(404).json({ message: 'Chef de Filière not found' });
    }

    // Optionally handle students associated with this chef before deleting:
    await Etudiant.update(
      { Filiere_Etudiant: null },
      { where: { Filiere_Etudiant: chefFiliereId } }
    );

    // Delete the chefFiliere from the database
    await chefFiliere.destroy();

    return res.status(200).json({ message: 'Chef de Filière deleted successfully' });
  } catch (error) {
    console.error('Error deleting Chef de Filière:', error);
    return res.status(500).json({ message: 'Error deleting Chef de Filière' });
  }
});

// Delete Entreprise
router.delete('/entreprise/:id', async (req, res) => {
  const entrepriseId = req.params.id;

  try {
    const entreprise = await Entreprise.findByPk(entrepriseId);

    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise not found' });
    }

    // Delete the entreprise from the database
    await entreprise.destroy();

    return res.status(200).json({ message: 'Entreprise deleted successfully' });
  } catch (error) {
    console.error('Error deleting entreprise:', error);
    return res.status(500).json({ message: 'Error deleting entreprise' });
  }
});




// Get Student by ID
router.get('/student/:id', async (req, res) => {
  const studentId = req.params.id;  // studentId is now a string

  try {
    // Use findOne to find the student by string-based ID
    const student = await Etudiant.findOne({
      where: { ID_Etudiant: studentId }, // Adjusted to use string ID
      include: [{
        model: ChefFiliere,
        as: 'Filiere', // This ensures we get the Filiere details
        attributes: ['Nom_CDF'], // Adjust this if you need more details
      }],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({ message: 'Error fetching student' });
  }
});

// Get ChefFiliere by ID
router.get('/chefFiliere/:id', async (req, res) => {
  const chefFiliereId = req.params.id.trim();  // Trim to remove any leading/trailing spaces
  console.log('Request received with ID:', chefFiliereId);

  try {
    // Use findOne to find the ChefFiliere by string-based ID
    const chefFiliere = await ChefFiliere.findOne({
      where: { ID_CDF: chefFiliereId },  // Adjusted to use string ID
    });

    if (!chefFiliere) {
      return res.status(404).json({ message: 'Chef de Filière not found' });
    }

    return res.status(200).json(chefFiliere);
  } catch (error) {
    console.error('Error fetching Chef de Filière:', error);
    return res.status(500).json({ message: 'Error fetching Chef de Filière' });
  }
});

// Get Entreprise by ID
router.get('/entreprise/:id', async (req, res) => {
  const entrepriseId = req.params.id;

  try {
    const entreprise = await Entreprise.findByPk(entrepriseId);

    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise not found' });
    }

    return res.status(200).json(entreprise);
  } catch (error) {
    console.error('Error fetching entreprise:', error);
    return res.status(500).json({ message: 'Error fetching entreprise' });
  }
});




// Route to get the list of Chefs de Filière
router.get('/chefsfiliere', async (req, res) => {
  try {
    const chefsFiliere = await ChefFiliere.findAll();
    res.json(chefsFiliere);
  } catch (error) {
    console.error('Error fetching chefs de filière:', error);
    res.status(500).json({ message: 'Error fetching chefs de filière' });
  }
});

// Route to get the list of Students
router.get('/students', async (req, res) => {
  try {
    const students = await Etudiant.findAll({
      include: [
        {
          model: ChefFiliere,
          as: 'Filiere',
          attributes: ['FiliereAssociee_CDF'], // Include related filière details
        },
      ],
    });

    // Add a full URL for CV_Etudiant field if it exists
    const studentsWithCV = students.map((student) => ({
      ...student.toJSON(),
      CV_Etudiant: student.CV_Etudiant
        ? `${req.protocol}://${req.get('host')}/uploads/cvs/${student.CV_Etudiant}`
        : null,
    }));

    res.json(studentsWithCV);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});



// Route to get the list of Entreprises
router.get('/entreprises', async (req, res) => {
  try {
    const entreprises = await Entreprise.findAll();
    res.json(entreprises);
  } catch (error) {
    console.error('Error fetching entreprises:', error);
    res.status(500).json({ message: 'Error fetching entreprises' });
  }
});


/* Route to get student statistics for the Gestionnaire*/
router.get('/statistics', async (req, res) => {
  try {

    const totalOffers = await Offre.count();
    const totalCompanys = await Entreprise.count();
    // Query the database for statistics
    const totalStudents = await Etudiant.count();
    /*const totalInternships = await Internship.count();
    const studentsWithInternships = await Student.count({ where: { hasInternship: true } });*/
    const totalInternships = 0;
    const studentsWithInternships = 0;

    // Send the statistics as a response
    res.json({
      totalOffers,
      totalCompanys,
      totalStudents,
      totalInternships,
      studentsWithInternships,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/me', validateToken, (req, res) => {
  // req.user contains decoded token information
  const ID_Gestionnaire = req.user.ID_Gestionnaire;
  const Email_Gestionnaire = req.user.Email_Gestionnaire;
  res.json({ ID_Gestionnaire, Email_Gestionnaire });
});
router.get('/find/:cdGest', async (req, res) => {
  const { cdGest } = req.params; // Extracting the parameter correctly
  try {
    // Query the database for the Gestionnaire
    const gestionnaire = await Gestionnaire.findOne({
      where: { ID_Gestionnaire: cdGest },
    });

    // If not found, return a 404 error
    if (!gestionnaire) {
      return res.status(404).json({ error: 'Gestionnaire not found' });
    }

    // Return the found Gestionnaire
    res.json(gestionnaire);
  } catch (error) {
    console.error('Error fetching Gestionnaire:', error);
    res.status(500).json({ error: 'Failed to fetch Gestionnaire' });
  }
});

// Route to get all internships
router.get('/internships', async (req, res) => {
  try {
    // Fetch all internships
    const internships = await Stage.findAll();

    // Send response
    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'An error occurred while fetching internships.' });
  }
});


// Endpoint to generate convention PDF
router.post('/internships/:idStage/generate-convention', async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const idStage = req.params.idStage;

    // Fetch the stage data from the database
    const stage = await Stage.findByPk(idStage);

    // Check if the stage exists
    if (!stage) {
      return res.status(404).send({ error: 'Stage not found.' });
    }

    console.log('Retrieved stage data:', stage.toJSON());

    // Map stage data to PDF content
    const pdfData = {
      // Primary Key
      ID_Stage: stage.ID_Stage,

      // Foreign Key
      ID_Entretien: stage.ID_Entretien,

      // Student-related fields
      ID_Etudiant: stage.ID_Etudiant,
      Nom_Etudiant: stage.Nom_Etudiant,
      Prenom_Etudiant: stage.Prenom_Etudiant,
      Date_Naissance_Etudiant: stage.Date_Naissance_Etudiant,
      Email_Etudiant: stage.Email_Etudiant,
      Tel_Etudiant: stage.Tel_Etudiant,
      Filiere_Etudiant: stage.Filiere_Etudiant,
      Annee_Etudiant: stage.Annee_Etudiant,

      // CDF-related fields
      Nom_CDF: stage.Nom_CDF,
      Prenom_CDF: stage.Prenom_CDF,
      Email_CDF: stage.Email_CDF,
      Tel_CDF: stage.Tel_CDF,

      // Company-related fields
      Nom_Entreprise: stage.Nom_Entreprise,
      Adresse_Entreprise: stage.Adresse_Entreprise,
      Tel_Entreprise: stage.Tel_Entreprise,
      Email_Entreprise: stage.Email_Entreprise,

      // Offer-related fields
      Titre_Offre: stage.Titre_Offre,
      Description_Offre: stage.Description_Offre,
      Durée: stage.Durée, // Duration of the stage
      Période: stage.Période, // Period of the stage
      Tuteur: stage.Tuteur, // Supervisor of the stage
    };


    // Generate the PDF
    const pdfPath = path.join(__dirname, `convention_${idStage}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR', {
      weekday: 'long', // e.g., 'mercredi'
      year: 'numeric', // e.g., '2024'
      month: 'long', // e.g., 'juillet'
      day: 'numeric' // e.g., '31'
    });

    doc.pipe(writeStream);

    // Add content to the PDF

    // Add an icon (image) to the header
    doc.image('./routes/Ensias.jpg', 50, 50, { width: 50 }); // Adjust the path and dimensions as necessary

    // Set font size and style for header text
    doc.fontSize(14).font('Helvetica-Bold').text('UNIVERSITE MOHAMMED V –RABAT', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Ecole Nationale Supérieure d’Informatique et d’Analyse des Systèmes', { align: 'center' });
    doc.moveDown(1)

    // Draw a line below the text
    doc.moveTo(40, doc.y + 5) // Move to just below the text
      .lineTo(550, doc.y + 5) // Horizontal line across the page
      .stroke(); // Apply the stroke to draw the line


    doc.moveDown(3).fontSize(12).font('Helvetica').text('Filière : ' + pdfData.Filiere_Etudiant, { align: 'left' });
    doc.text('CONVENTION DE STAGE DE FIN de ' + pdfData.Annee_Etudiant, { align: 'center', fontSize: 14, font: 'Helvetica-Bold' });

    // Add the next part of the document text
    doc.moveDown().text(`Au cours de sa formation, l’Elève Ingénieur de l’ENSIAS est appelé à effectuer chaque année un stage d’été de durée 4 semaines au minimum pendant la période allant du 5 juin au 8 septembre 2024. Durant cette période le stagiaire pourrait être amené à se présenter aux examens de rattrapages du semestre 4. Ces examens pourraient prendre pour un stagiaire au maximum une semaine qui ne sera pas comptabilisée dans la durée de son stage. Ce stage est régi par une convention entre les parties concernées.`, { align: 'justify' });

    // Add convention parties details
    doc.moveDown().text('La présente convention relative au stage de fin d’année est conclue entre :', { align: 'justify' });
    doc.moveDown().text(`L’Ecole Nationale Supérieure d’Informatique et d’Analyse des Systèmes, représentée par son directeur par Mme. Ilham BERRADA.`, { align: 'justify' });
    doc.text(`L’organisme d’accueil ${pdfData.Nom_Entreprise} à ${pdfData.Adresse_Entreprise}.`, { align: 'justify' });
    doc.text(`Et l’élève ingénieur stagiaire ${pdfData.Prenom_Etudiant} ${pdfData.Nom_Etudiant} inscrit(e) en ${pdfData.Annee_Etudiant} de l’ENSIAS, concernant son stage de fin d’année encadré par ${pdfData.Tuteur}.`, { align: 'justify' });

    // Article 1: Stage Period
    doc.moveDown().text('Article 1:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`La période du stage : ${pdfData.Période}.`, { align: 'left' });

    // Article 2: Stage Engagement
    doc.moveDown().text('Article 2:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`L’élève ingénieur stagiaire ${pdfData.Prenom_Etudiant} ${pdfData.Nom_Etudiant} s’engage à effectuer son stage de fin d’année tel qu’il est stipulé dans cette convention et ne peut prétendre à un changement de son affectation initiale durant cette période qu’après autorisation écrite de l’ENSIAS.`, { align: 'justify' });
    doc.text(`L’organisme d’accueil est tenu d’avertir la direction de L’ENSIAS dans un délai d’une semaine si l’élève ingénieur stagiaire ne se présente pas à son lieu d’affectation dans les délais prévus.`, { align: 'justify' });

    // Article 3: Stage Organization and Work Subject
    doc.moveDown().text('Article 3:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`L’organisation du stage de fin d’année ainsi que les travaux et sujets d’étude confiés à l’élève ingénieur stagiaire sont proposés par L’organisme d’accueil et doivent se dérouler conformément à la fiche de description de stage.`, { align: 'justify' });
    doc.text(`Le sujet du stage s’intitule : ${pdfData.Titre_Offre}.`, { align: 'justify' });

    doc.moveDown().text('Article 4:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`Pendant la durée de son séjour au sein de l’organisme d’accueil, l’élève ingénieur stagiaire relève toujours de l’ENSIAS ; il est néanmoins soumis au règlement en vigueur dans l’organisme d’accueil notamment en ce qui concerne la discipline, l’horaire de travail et les règles de prévention, d’hygiène, de sécurité de travail et de confidentialité.En cas de manquement à la discipline, l’organisme d’accueil, en accord avec la direction de l’ENSIAS, a le droit de mettre fin au stage de l’élève ingénieur stagiaire contrevenant`, { align: 'justify' });

    doc.moveDown().text('Article 5:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`A l’issue du stage : L’élève ingénieur stagiaire doit remettre au Service de Scolarité ainsi qu’à l’organisme d’accueil une copie du rapport de stage.L’organisme d’accueil est tenu de remettre sous pli fermé à l’étudiant la fiche d’évaluation le concernant remplie par son encadrant et comportant un quitus attestant que l’intéressé est en règle vis-à-vis dudit organisme.`, { align: 'justify' });

    doc.moveDown().text('Article 6:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`L’élève ingénieur stagiaire s’engage à ne pas publier ou divulguer les informations confidentielles appartenant à l’organisme d’accueil dont il pourrait avoir pris connaissance pendant son stage.`, { align: 'justify' });

    doc.moveDown().text('Article 7:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`L’élève ingénieur stagiaire ${pdfData.Prenom_Etudiant} ${pdfData.Nom_Etudiant} est couvert (e) par une assurance contre les accidents pouvant survenir au cours des stages qu’il accomplit à l’extérieur de l’Ecole dans la limite de garantie de cette assurance.`, { align: 'justify' });

    doc.moveDown().text('Article 8:', { align: 'left', fontSize: 12, font: 'Helvetica-Bold' });
    doc.text(`Le stage de fin d’année n’est validé qu’après signature de la présente convention par toutes les parties concernées. `, { align: 'justify' });



    // Draw a line below the text
    doc.moveDown().moveTo(40, doc.y + 5) // Move to just below the text
      .lineTo(550, doc.y + 5) // Horizontal line across the page
      .stroke(); // Apply the stroke to draw the line


    // Adding signature section
    doc.moveDown(2) // Move down to create space before signatures
    doc.font('Helvetica').text(`A Rabat, le ${formattedDate}`, { align: 'right' });
    doc.moveDown(1)
    // Signature title
    doc.font('Helvetica').text('Signature du directeur de                                                         Signature du Directeur de', { align: 'left' });
    doc.font('Helvetica').text('  l’organisme d’accueil                                                                           l’ENSIAS', { align: 'left' });
    doc.font('Helvetica').text('    (Lu et approuvé)                                                                      (ou de son représentant)', { align: 'left' });

    doc.moveDown(8) // Move down to create space before signatures

    // Add space for the student signature
    doc.font('Helvetica').text('Signature du l’élève ingénieur stagiaire', { align: 'left' });
    doc.moveDown(2);  // Space between title and signature line







    doc.end();

    // Wait for the PDF to finish writing
    writeStream.on('finish', () => {
      console.log('PDF file successfully written:', pdfPath);
      res.status(200).sendFile(pdfPath, (err) => {
        if (err) {
          console.error('Error sending PDF file:', err);
        }

        // Optional: Delete the file after sending it
        fs.unlink(pdfPath, (err) => {
          if (err) {
            console.error('Error deleting PDF file:', err);
          } else {
            console.log('Temporary PDF file deleted.');
          }
        });
      });
    });

  } catch (error) {
    console.error('Error generating convention:', error);
    res.status(500).send({ error: 'Failed to generate convention.' });
  }
});

module.exports = router;
