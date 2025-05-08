const db = require('../config/db');

// 📌 Créer une nouvelle agence
const createAgence = (agence, callback) => {
  const sql = `
    INSERT INTO agence (nom, adresse, contact, email, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [agence.nom, agence.adresse, agence.contact, agence.email, agence.password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'agence :', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};



// 📌 Obtenir une agence par email
const getAgenceByEmail = (email, callback) => {
  const sql = `SELECT * FROM agence WHERE email = ?`;
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'email :', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};



// Met à jour agence, puis récupère ses données depuis la base
const updateAgence = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE agence SET ? WHERE id = ?';

    db.query(updateQuery, [updatedData, id], (err, result) => {
      if (err) {
        return reject(err);
      }

      // Sélectionner les données mises à jour depuis la base 
      const selectQuery = 'SELECT id, nom, email,contact, adresse, description, contact FROM agence WHERE id = ?';
      db.query(selectQuery, [id], (err, rows) => {
        if (err) {
          return reject(err);
        }
        // retourne les infos mises à jour
        resolve(rows[0]); 
      });
    });
  });
};

module.exports = {
  createAgence,
  getAgenceByEmail,
  updateAgence
};
