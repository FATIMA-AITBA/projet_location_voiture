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


module.exports = {
    getAllVoitures,
};
