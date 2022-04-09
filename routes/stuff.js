// Fichier route

const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff');

// *************** Routes *************************
/* router => appelle express avec la fonction Router
   la méthode => get;post;put;delete
   stuffCtrl renvoie au fichier stuff du dossier controllers
   le point relie la fonction, la nomination de la fonction fait référence à son rôle.
*/

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

// *************************************************

module.exports = router;