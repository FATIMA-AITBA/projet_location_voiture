const db = require('../config/db');

// Récupérer toutes les voitures
const getAllVoitures = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM voiture';
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



const createCar = (carData) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO voiture 
      (name, carType, marque, places, nombre_portes, nombre_bagages, 
       typeBoite, fuelType, lieu_retrait, lieu_retour, prix_par_jour, 
       kilometrage_inclus, tarif_km_sup, tarif_km_illimites_par_jour, disponible, id_agence, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      carData.name,
      carData.carType,
      carData.marque,
      carData.places,
      carData.nombre_portes,
      carData.nombre_bagages,
      carData.typeBoite,
      carData.fuelType,
      carData.lieu_retrait,
      carData.lieu_retour,
      carData.prix_par_jour,
      carData.kilometrage_inclus,
      carData.tarif_km_sup,
      carData.tarif_km_illimites_par_jour,
      carData.disponible || 1, // Valeur par défaut 1 si non fourni
      carData.id_agence,
      carData.image 
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId); // Retourne l'ID de la nouvelle voiture
    });
  });
};



module.exports = {
  createCar,
  getAllVoitures
};