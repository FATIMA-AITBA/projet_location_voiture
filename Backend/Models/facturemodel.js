const db = require('../config/db'); // adapte le chemin si nécessaire

const addFacture = ({
  id_client,
  entreprise,
  nom_chauffeur,
  prenom_chauffeur,
  email_chauffeur,
  telephone_chauffeur,
  pays,
  rue,
  code_postal,
  ville
}) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Facture (
        dateFacturation, id_client,
        entreprise, nom_chauffeur, prenom_chauffeur, email_chauffeur, telephone_chauffeur,
        pays, rue, code_postal, ville
      )
      VALUES (
        CURRENT_DATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;

    const params = [
      id_client,
      entreprise,
      nom_chauffeur,
      prenom_chauffeur,
      email_chauffeur,
      telephone_chauffeur,
      pays,
      rue,
      code_postal,
      ville
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("MySQL addFacture ERROR:", err.sqlMessage);
        return reject(err);
      }
      console.log("MySQL addFacture RESULT:", result);
      resolve(result);
    });
  });
};

module.exports = { addFacture };
