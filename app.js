const express = require('express');

const app = express();

app.use(express.json());

const Thing = require('./models/thing');

const dotenv = require('dotenv').config();

const mongoose = require('mongoose');
const { db } = require('./models/thing');

 mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdge6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// *************** Middlewares ********************************
// Correction des erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


/* Envoyer l'objet dans la base de données(route post) =======
Ici, vous créez une instance de votre modèle Thing 
en lui passant un objet JavaScript contenant toutes 
les informations requises du corps de requête analysé 
(en ayant supprimé en amont le faux_id envoyé par le front-end).
La méthode save() enregistre simplement votre Thing dans la base de données.
*/
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});


/* Modification de l'élément ou Thing(route put) ===
La méthode updateOne() permet de mettre à jour 
le Thing qui correspond à l'objet que nous passons comme premier argument. 
Nous utilisons aussi le paramètre id passé dans la demande, 
et le remplaçons par le Thing passé comme second argument.
*/
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});


/* Supprimer un élément ou un Thing(route delete) =====
La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() 
dans le sens où nous lui passons un objet correspondant au document à supprimer.
Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
*/
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});


/* Récupérer un élément par son identifiant(route get) ===
Les deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre;
La méthode findOne() permet de trouver le Thing unique ayant le même _id que le paramètre de la requête ;
ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
si aucun Thing n'est trouvé ou si une erreur se produit, 
nous envoyons une erreur 404 au front-end, avec l'erreur générée.
*/
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});


/* Récupérer la liste des objets dans la base de données(route get) ====
la méthode find() dans notre modèle Mongoose, 
renvoyer un tableau contenant tous les Things dans notre base de données. 
À présent, si vous ajoutez un Thing , 
il doit s'afficher immédiatement sur votre page d'articles en vente.
*/
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

// *************** fin des middlewares ****************************

module.exports = app;