const { createAgence, getAgenceByEmail, updateAgence } = require('../Models/agencemodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // assure-toi que cette ligne existe bien

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

// 🔐 Enregistrement d'une agence
exports.register = async (req, res) => {
  try {
    const { nom, adresse, contact, email, password, description } = req.body;

    if (!nom || !adresse || !contact || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs obligatoires sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgence = { nom, adresse, contact, email, password: hashedPassword, description };

    createAgence(newAgence, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur', error: err });
      }
      res.status(201).json({ message: 'Agence inscrite avec succès', id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription', error });
  }
};

// 🔓 Connexion d’une agence
exports.login = async (req, res) => {
  const { email, password } = req.body;

  getAgenceByEmail(email, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const agence = results[0];
    const isMatch = await bcrypt.compare(password, agence.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: agence.id, email: agence.email },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      agence: {
        id: agence.id,
        nom: agence.nom,
        email: agence.email,
        adresse: agence.adresse,
        contact: agence.contact,
        description: agence.description || ""
      }
    });
  });
};



exports.updateProfile = async (req, res) => {
  const agenceId = req.client.id; 
  const { nom, adresse, contact, email, description } = req.body;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedData = { nom, adresse, contact, email, description };

    // Optionnel : retirer les champs non définis
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    const updatedAgence = await updateAgence(agenceId, updatedData);

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      updatedData: updatedAgence,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
