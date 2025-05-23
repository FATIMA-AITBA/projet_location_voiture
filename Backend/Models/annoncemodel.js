// Models/annonceModel.js
const db = require('../config/db');

/**
 * Récupère les annonces (voitures) pour une agence donnée,
 * avec le nombre de réservations en attente uniquement si la voiture est active.
 */
function getAnnoncesByAgence(id_agence) {
  return new Promise((resolve, reject) => {
    const sql = `
  SELECT
    v.id,
    v.name,
    CAST(v.disponible AS UNSIGNED) AS disponible,
    COUNT(r.id_reservation) AS pendingReservations
  FROM voiture v
  LEFT JOIN reservation r
    ON r.id_voiture = v.id
    AND r.status = 'pending'
  WHERE v.id_agence = ?
  GROUP BY v.id, v.name, v.marque, v.disponible
  ORDER BY v.id DESC
`;

    db.query(sql, [id_agence], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  getAnnoncesByAgence,
};
