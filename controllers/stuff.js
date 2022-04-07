// Fichier logique métier

const Thing = require("../models/thing");

/* createThing() est une fonction ===
Envoyer l'objet dans la base de données
Ici, vous créez une instance de votre modèle Thing 
en lui passant un objet JavaScript contenant toutes 
les informations requises du corps de requête analysé 
(en ayant supprimé en amont le faux_id envoyé par le front-end).
La méthode save() enregistre simplement votre Thing dans la base de données.
*/
exports.createThing = (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
  });
  thing.save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* getOneThing() est une fonction ===
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

/* modifyThing() est une fonction ===
Modification de l'élément ou Thing
La méthode updateOne() permet de mettre à jour 
le Thing qui correspond à l'objet que nous passons comme premier argument. 
Nous utilisons aussi le paramètre id passé dans la demande, 
et le remplaçons par le Thing passé comme second argument.
*/
exports.modifyThing = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* deleteThing() est une fonction ===
Supprimer un élément ou un Thing
La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() 
dans le sens où nous lui passons un objet correspondant au document à supprimer.
Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
*/
exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* getAllStuff() est une fonction ===
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
