// Fichier route

const express = require('express');

const router = express.Router();


const stuffCtrl = require('../controllers/stuff');

// *************** Routes *************************
/* router => appelle express avec la fonction Router
   la méthode => get;post;put;delete
   stuffCtrl renvoie au fichier stuff du dossier controllers
   le point relie la fonction, la nomination de la fonction fait référence à son rôle.
*/

router.get('/', stuffCtrl.getAllStuff);
router.post('/', stuffCtrl.createThing);
router.get('/:id', stuffCtrl.getOneThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);

// *************************************************

module.exports = router;