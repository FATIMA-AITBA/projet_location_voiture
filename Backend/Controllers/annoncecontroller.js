const db = require('../config/db');

const getAnnonces = async (req, res) => {
  const agenceId = req.client.id;

  const query = `
    SELECT 
      v.id,
      v.name AS vehicule,
      v.disponible,
      (
        SELECT COUNT(*) 
        FROM reservation r 
        WHERE r.id_voiture = v.id AND r.confirmee = 0
      ) AS reservations_en_attente
    FROM voiture v
    WHERE v.id_agence = ?
  `;

  db.query(query, [agenceId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des annonces :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const annonces = results.map(voiture => ({
      id: voiture.id,
      name: voiture.vehicule,
      disponible: voiture.disponible,
      reservationsEnAttente: voiture.reservations_en_attente
    }));

    res.json(annonces);
  });
};

module.exports = {
  getAnnonces
};
