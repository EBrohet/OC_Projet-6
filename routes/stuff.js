const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');
const optimise = require ('../middleware/sharp-config');

const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, multer, optimise, stuffCtrl.createBook);
router.post('/:id/rating', auth, stuffCtrl.rateBook);
router.get('/bestrating', stuffCtrl.bestRating);
router.put('/:id', auth, multer, optimise, stuffCtrl.modifyBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.get('/:id', stuffCtrl.getOneBook);
router.get('/', stuffCtrl.getAllBooks);

module.exports = router;