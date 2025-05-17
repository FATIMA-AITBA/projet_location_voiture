const { addFacture } = require('../Models/facturemodel');

exports.createFacture = async (req, res) => {
  const {
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
  } = req.body;

  // Vérification des champs obligatoires
  if (
    !id_client ||
    !nom_chauffeur ||
    !prenom_chauffeur ||
    !email_chauffeur ||
    !telephone_chauffeur ||
    !pays ||
    !rue ||
    !code_postal ||
    !ville
  ) {
    return res.status(400).json({ message: 'Certains champs obligatoires sont manquants' });
  }

  try {
    await addFacture({
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
    });

    res.status(201).json({ message: 'Facture créée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de la facture :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la facture', error });
  }
};
