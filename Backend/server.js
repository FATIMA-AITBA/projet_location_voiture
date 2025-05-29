const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const clientRoutes = require('./routes/clientRoutes');  // Routes pour les clients
const agenceRoutes = require('./routes/agenceRoutes');  // Routes pour les agences
const reservationRoutes = require('./routes/reservationRoutes');
const reservationHistoryRoutes = require('./routes/reservationHistoryRoutes'); // Routes pour les réservations
const voitureRoutes = require('./routes/voitureRoutes'); // Routes pour les voitures
const factureRoutes = require('./routes/factureRoutes'); // Routes pour les factures
const annonceRoutes=require('./routes/annonceRoutes')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // l'adresse de ton frontend React 
    credentials: true
}));
app.use(express.json());



//  Sert les fichiers statiques dans le dossier "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Utilisation des routes pour clients et agences
app.use('/api/clients', clientRoutes); // Route pour les clients
app.use('/api/agences', agenceRoutes); // Route pour les agences
app.use('/api/reservations', reservationRoutes); // Route pour les réservations
app.use('/api/reservations-historique', reservationHistoryRoutes); // Route pour les réservations
app.use('/api/voitures', voitureRoutes); // Route pour les voitures
app.use('/api/factures', factureRoutes); // Route pour les factures

app.use('/api/annonces', annonceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

