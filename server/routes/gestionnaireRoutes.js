const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const { Gestionnaire, Etudiant, ChefFiliere, Entreprise } = require('../models');  // Import models
/*const { validateToken } = require('../middlewares/AuthMiddleware');*/
const fs = require('fs');
const path = require('path');
const etudiant = require('../models/etudiant');

const router = express.Router();


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
          attributes: ['FiliereAssociee_CDF'], // You can choose the attributes to include from the ChefFiliere model
        },
      ],
    });
    res.json(students);
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
    // Query the database for statistics
    const totalStudents = await Etudiant.count();
    /*const totalInternships = await Internship.count();
    const studentsWithInternships = await Student.count({ where: { hasInternship: true } });*/
    const totalInternships = 0;
    const studentsWithInternships = 0;

    // Send the statistics as a response
    res.json({
      totalStudents,
      totalInternships,
      studentsWithInternships,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});





module.exports = router;
