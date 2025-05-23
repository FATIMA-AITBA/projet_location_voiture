const db = require('../Config/db');

const getAnnonces = async (req, res) => {
  const agenceId = req.user.id; // ID de l'agence connectée

  const query = `
    SELECT 
      v.id,
      v.name AS vehicule,
      v.disponible,
      (
        SELECT COUNT(*) 
        FROM reservation r 
        WHERE r.voiture_id = v.id AND r.statut = 'en attente'
      ) AS reservations_en_attente
    FROM voiture v
    WHERE v.id_agence = ?
  `;

  db.query(query, [agenceId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des annonces :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const annonces = results.map(voiture => {
      const statut = voiture.disponible === 1 ? 'Active' : 'Inactive';
      const reservations = voiture.disponible === 1 ? voiture.reservations_en_attente : '-';

      return {
        id: voiture.id,
        vehicule: voiture.vehicule,
        statut: statut,
        reservationsEnAttente: reservations
      };
    });

    
    console.log('Résultat brut de la base :', results);


    res.json(annonces);
  });
};

module.exports = {
  getAnnonces
};
