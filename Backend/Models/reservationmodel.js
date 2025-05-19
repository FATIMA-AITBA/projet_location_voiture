const db = require('../config/db');

// Récupérer les réservations d'un client a paratir de la base de données
const getReservationsByClient = (clientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
         SELECT 
            r.id_reservation,
            DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_reservation,
            v.name AS nom_voiture,
            a.nom AS nom_agence,
            r.confirmee,
            DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
            v.lieu_retrait,
            DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
            v.lieu_retour,
            r.annulee,
            r.reservee
        FROM 
            reservation r
        JOIN 
            voiture v ON r.id_voiture = v.id
        JOIN 
            agence a ON v.id_agence = a.id
        WHERE 
            r.id_client = ? AND  r.annulee = 0;

    `;

    db.query(sql, [clientId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// Mettre à jour le statut d'annulation d'une réservation dans la base de données
const updateAnnulation = (reservationId, newStatus) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE reservation
      SET annulee = ?
      WHERE id_reservation = ?;
    `;

    db.query(sql, [newStatus, reservationId], (err, results) => {
      if (err) return reject(err);
      if (results.affectedRows === 0) {
        return reject(new Error('Réservation non trouvée'));
      }
      resolve(results);
    });
  });
};


const getAllReservationsWithVoiture = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        r.id_reservation,
        DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
        DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
        v.id AS id_voiture,
        v.name AS nom_voiture,
        v.marque AS marque_voiture
      FROM reservation r
      JOIN voiture v ON r.id_voiture = v.id where r.confirmee = 1
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const addReservation = ({ date_depart, date_retour, id_voiture, id_client, prix_journalier, montantHT,TVA,supp_local,total_frais,montantTTC,kilometrageType }) => {
  return new Promise((resolve, reject) => {
    const sql = `
  INSERT INTO reservation 
    (date_depart, date_retour, date_reservation, id_voiture, id_client, prix_journalier, montantHT, TVA, supp_local, total_frais, montantTTC, kilometrageType, confirmee, annulee)
  VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
`;             

    const params = [date_depart, date_retour, id_voiture, id_client,prix_journalier, montantHT, TVA, supp_local, total_frais, montantTTC, kilometrageType];
    console.log("📤 SQL addReservation:", sql.trim(), params);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ MySQL addReservation ERROR:", err.sqlMessage);
        return reject(err);
      }
      console.log("✅ MySQL addReservation RESULT:", result);
      resolve(result);
    });
  });
};






const getReservationsEnAttenteByAgence = (id_agence, callback) => {
  const query = `
    SELECT 
      r.id_reservation,
      DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
      DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
      DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_demande,
      v.name AS nom_voiture,
      c.nom AS nom_client
    FROM reservation r
    JOIN voiture v ON r.id_voiture = v.id
    JOIN client c ON r.id_client = c.id
    WHERE v.id_agence = ? AND r.confirmee = 0 AND r.annulee = 0 AND r.reservee=0
  `;

  db.query(query, [id_agence], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

//confirmation + desactiver la dispo de la voiture 

const confirmReservation = (reservationId) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (errTransaction) => {
      if (errTransaction) return reject(errTransaction);

      try {
        // 1. Récupération de l'ID voiture (CORRIGÉ)
        const [rows] = await db.promise().query(
          'SELECT id_voiture FROM reservation WHERE id_reservation = ?',
          [reservationId]
        );
        
        if (rows.length === 0) throw new Error('Réservation introuvable');
        const idVoiture = rows[0].id_voiture;

        // 2. Confirmation réservation
        await db.promise().query(
          'UPDATE reservation SET confirmee = 1 WHERE id_reservation = ?',
          [reservationId]
        );

        // 3. Mise à jour disponibilité voiture (AJOUT DE LOGS)
        console.log(`🔄 Mise à jour disponibilité voiture ID: ${idVoiture}`);
        const updateResult = await db.promise().query(
          'UPDATE voiture SET disponible = 0 WHERE id = ?',
          [idVoiture]
        );
        console.log('📌 Résultat mise à jour:', updateResult[0]);

        // Validation transaction
        db.commit((errCommit) => {
          if (errCommit) {
            console.error('❌ Erreur commit:', errCommit);
            db.rollback(() => reject(errCommit));
          } else {
            console.log('✅ Transaction confirmée');
            resolve();
          }
        });
      } catch (error) {
        console.error('💥 Erreur transaction:', error);
        db.rollback(() => reject(error));
      }
    });
  });
};

const getReservationsConfirmeesByAgence = (id_agence, callback) => {
  const query = `
    SELECT 
      r.id_reservation,
      DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
      DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
      DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_demande,
      v.name AS nom_voiture,
      c.nom AS nom_client,
      r.annulee,
      r.reservee
    FROM reservation r
    JOIN voiture v ON r.id_voiture = v.id
    JOIN client c ON r.id_client = c.id
    WHERE v.id_agence = ? AND r.confirmee = 1;
  `;

  db.query(query, [id_agence], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

//gerer bouton retourneee

const marquerRetournee = (reservationId) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) return reject(err);

      try {
        // 1. Récupération des données étendues
        const [rows] = await db.promise().query(
          `SELECT 
            id_voiture, 
            id_client,
            date_depart,
            date_retour,
            date_reservation,
            CAST(annulee AS SIGNED) AS annulee,
            CAST(reservee  AS SIGNED) AS reservee 
           FROM reservation 
           WHERE id_reservation = ?`,
          [reservationId]
        );

        if (rows.length === 0) throw new Error('Réservation introuvable');
        const reservation = rows[0];

        // 2. Mise à jour disponibilité voiture (comportement existant)
        await db.promise().query(
          'UPDATE voiture SET disponible = 1 WHERE id = ?',
          [reservation.id_voiture]
        );

        // 3. Nouveau traitement pour réservation confirmée
        if (reservation.reservee === 1) {
          // Archivage dans l'historique
          await db.promise().query(
            `INSERT INTO historique_reservation 
             (id_client, id_voiture, date_depart, date_retour, date_reservation)
             VALUES (?, ?, ?, ?, ?)`,
            [
              reservation.id_client,
              reservation.id_voiture,
              reservation.date_depart,
              reservation.date_retour,
              reservation.date_reservation
            ]
          );
        }

        // 4. Suppression conditionnelle (comportement existant étendu)
        if (reservation.annulee === 1 || reservation.reservee === 1) {
          await db.promise().query(
            'DELETE FROM reservation WHERE id_reservation = ?',
            [reservationId]
          );
        }

        db.commit((err) => {
          if (err) reject(err);
          resolve({ 
            deleted: reservation.annulee === 1 || reservation.reservee === 1,
            archived: reservation.reservee === 1
          });
        });

      } catch (error) {
        db.rollback(() => reject(error));
      }
    });
  });
};




const getReservationById = (reservationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        r.id_reservation,
        r.id_voiture,
        r.prix_journalier,
        r.montantHT,
        r.TVA,
        r.supp_local,
        r.total_frais,
        r.montantTTC,
        r.kilometrageType,
        v.image,
        v.name,
        v.marque,
        v.carType,
        v.fuelType,
        v.typeBoite,
        v.places,
        v.nombre_bagages,
        v.lieu_retrait,
        DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
        v.lieu_retour,
        DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour
      FROM 
        reservation r
      JOIN 
        voiture v ON r.id_voiture = v.id
      WHERE 
        r.id_reservation = ?;
    `;

    db.query(sql, [reservationId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // une seule réservation
    });
  });
};



const confirmerReservation = (reservationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE reservation
      SET reservee = 1
      WHERE id_reservation = ?;
    `;

    db.query(sql, [reservationId], (err, results) => {
      if (err) return reject(err);
      if (results.affectedRows === 0) {
        return reject(new Error('Réservation non trouvée'));
      }
      resolve(results);
    });
  });
};


//supprimer reservation 
const deleteReservation = (reservationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM reservation
      WHERE id_reservation = ?;
    `;
    db.query(sql, [reservationId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



module.exports = {
  getReservationsByClient,
  updateAnnulation,
  getAllReservationsWithVoiture,
  addReservation,
  getReservationsEnAttenteByAgence,
  confirmReservation,
  getReservationsConfirmeesByAgence,
  marquerRetournee,
  getReservationById,
  confirmerReservation,
  deleteReservation
};

