// Fichier logique métier

const Thing = require("../models/Thing");
const fs = require('fs');

/*createThing() est une fonction ===
  Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, 
  et non sous forme de JSON. 
  Le corps de la requête contient une chaîne thing qui est simplement un objet Thing converti en chaîne. 
  Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
  Ici, vous créez une instance de votre modèle Thing 
  en lui passant un objet JavaScript contenant toutes 
  les informations requises du corps de requête analysé 
  (en ayant supprimé en amont le faux_id envoyé par le front-end).
  Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ).
  Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
  Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
  La méthode save() enregistre simplement votre Thing dans la base de données.
*/
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

/*getOneThing() est une fonction ===
  Récupérer un élément par son identifiant
  Les deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre;
  La méthode findOne() permet de trouver le Thing unique ayant le même _id que le paramètre de la requête ;
  ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
  si aucun Thing n'est trouvé ou si une erreur se produit, 
  nous envoyons une erreur 404 au front-end, avec l'erreur générée.
*/
exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

/*modifyThing() est une fonction ===
  Modification de l'élément ou Thing
  On crée un objet thingObject qui regarde si req.file existe ou non. 
  S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 
  On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.
  La méthode updateOne() permet de mettre à jour 
  le Thing qui correspond à l'objet que nous passons comme premier argument. 
  Nous utilisons aussi le paramètre id passé dans la demande, 
  et le remplaçons par le Thing passé comme second argument.
*/
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

/*deleteThing() est une fonction ===
  Supprimer un élément ou un Thing
  Avec la méthode findOne seul le propriétaire d'un Thing peut le supprimer.
  Nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
  Avec la méthode split('/images/')[1], nous récupérons le nom du fichier.
  Ensuite la fonction unlink du package fs pour supprimer ce fichier, 
  en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
  dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.
  La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() 
  dans le sens où nous lui passons un objet correspondant au document à supprimer.
  Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
*/
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/*getAllStuff() est une fonction ===
  Récupérer la liste des objets dans la base de données
  la méthode find() dans notre modèle Mongoose, 
  renvoyer un tableau contenant tous les Things dans notre base de données. 
  À présent, si vous ajoutez un Thing , 
  il doit s'afficher immédiatement sur votre page d'articles en vente.
*/
exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
