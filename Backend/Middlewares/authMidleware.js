const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.authenticateClient = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Authorization Header:', authHeader);  // Vérifier si l'en-tête est bien reçu

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.client = decoded; // contient { id, email }
    console.log('Token Décodé:', decoded);  // Vérifier le contenu du token
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    return res.status(401).json({ message: 'Token invalide' });
  }
};

