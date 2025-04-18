const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
// Serve static files from 'uploads/cvs' folder
app.use('/uploads/cvs', express.static(path.join(__dirname, 'uploads', 'cvs')));


app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const gestionnaireRoutes = require("./routes/gestionnaireRoutes");
const entrepriseRoutes = require("./routes/entrepriseRoutes"); // Add Entreprise routes
const chefFiliereRoutes = require("./routes/chefFiliereRoutes"); // Add Chef de Filière routes
const etudiantRoutes = require("./routes/etudiantRoutes")

//const authRoutes = require("./routes/authRoutes"); // Add authentication routes

/* Middleware
const { validateToken } = require("./middlewares/AuthMiddleware");*/

// Use routes
app.use("/gestionnaire", gestionnaireRoutes);
app.use("/etudiant", etudiantRoutes);
app.use("/chefdefiliere", chefFiliereRoutes);
app.use("/entreprise", entrepriseRoutes);
//app.use("/auth", authRoutes); // For authentication routes (login, token management, etc.)

/* Route to verify token
app.get("/auth/verify", (req, res) => {
    res.status(200).json({ message: "Token is valid!" });
});*/

// Synchronize models and start the server
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});
