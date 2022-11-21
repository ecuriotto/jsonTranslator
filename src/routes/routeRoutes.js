const express = require('express');

const routeController = require('../controllers/routeController');
//  Create route handler
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { translations: []
    });
});
// POST Translation Page
//router.post('/getHelperTranslations/:lang', translationsMaster.getTranslationsMaster);

router.post('/saveDataFromFile/:lang',routeController.saveDataFromFile);
router.get('/getData/:lang',routeController.getData)
router.post('/saveInFirestore/:lang',routeController.saveInFirestore);

// Export router
module.exports = router;