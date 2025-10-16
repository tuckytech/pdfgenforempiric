const { generatePDF } = require('../controllers/pdf-generation.js');
const authenticateToken = require('../middlewares/auth');
const verifyAccessToken = require('../middlewares/verifyAccessToken.js');
const router = require('express').Router();

router.post('/generate', authenticateToken, verifyAccessToken, generatePDF);

module.exports = router;