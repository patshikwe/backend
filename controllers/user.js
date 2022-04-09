// Fichier d'inscription et d'authentification d'utilisateur, implémentaion de la logique

const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/*nous appelons la fonction de hachage de bcrypt dans notre mot de passe
 et lui demandons de « saler » le mot de passe 10 fois. 
 Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.
 Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
 dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, 
 en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec.
*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


/*nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur
 correspond à un utilisateur existant de la base de données;
 dans le cas contraire, nous renvoyons une erreur 401 Unauthorized,
 si l'e-mail correspond à un utilisateur existant, nous continuons.
 Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe
 entré par l'utilisateur avec le hash enregistré dans la base de données;
 s'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized 
 et un message « Mot de passe incorrect ! »,
 s'ils correspondent, les informations d'identification de notre utilisateur sont valides. 
 Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token. Ce token est une chaîne générique pour l'instant.
*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};