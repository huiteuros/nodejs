const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const HEADER = { 'cache-control': 'no-cache', 'x-apikey': 'fb59b6db4a85575897bbf2f4e44772075146f' }
const ADDRESS = 'https://tpnotenodejsaxellebg-46db.restdb.io/rest'// Désolé pour le nom de la BDD, on avait trouvé ça drole en tp et on a pas réussi à le changer
const cors = require('cors')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const secret = 'motmagikbogoss'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

passport.use(
    new JwtStrategy(jwtOptions, async function (payload, next) {
        const users = await axios.get(ADDRESS + '/users', {
            headers: HEADER
        })
            .then(result => {
                return result.data
            })

        const user = users.find(user => user.email === payload.email)

        if (user) {
            next(null, user)
        } else {
            next(null, false)
        }
    })
)

app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    cors(),
    passport.initialize()
)
app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT)
})

app.get('/', function (req, res) {
  res.send('Home page')
})

const axios = require('axios');

app.get('/plats', function (req, res) {
  axios.get(ADDRESS+'/plats', {
  headers: HEADER })
  .then(result => res.json(result.data))
})

app.get('/plats/:id', function (req, res) {
    axios.get(ADDRESS+'/plats/'+req.params.id, {
    headers: HEADER })
    .then(result => res.json(result.data))
})

// Cette route est censée nous permettre d'ajouter un plat uniquement si nous sommes connectés. Mais on n'a pas réussi à la tester avec postman
app.post('/ajouterPlatV2', passport.authenticate('jwt', { session: false }), function(req, res) {
    axios.post(ADDRESS+'/plats', req.body, {headers : HEADER})
            .then(result => res.json("Plat ajouté"))
})

app.post('/ajouterPlat', function(req, res) {
    axios.post(ADDRESS+'/plats', req.body, {headers : HEADER})
        .then(result => res.json("Plat ajouté"))
})

app.post('/supprimerPlat/:id', function(req, res){
    axios.delete(ADDRESS+'/plats/'+req.params.id, {headers : HEADER})
        .then(result => res.json("Plat supprimé"))
})

app.put('/modifierPlat/:id', function(req, res) {
    axios.put(ADDRESS+'/plats/'+req.params.id, req.body, {headers : HEADER})
        .then(result => res.json("Plat modifié"))
})

app.post('/connexion', async (req, res) => {
    const email = req.body.email
    const mdp = req.body.mdp

    if (!email || !mdp) {
        res.status(401).json({error: 'Email ou mot de passe non fourni'})
        return
    }

    const users = await axios.get(ADDRESS + '/users', {
        headers: HEADER
    })
        .then(result => {return result.data})

    const user = users.find(user => user.email === email)

    if (!user || user.mdp !== mdp) {
        res.status(401).json({error: 'la combinaison email / mdp n\'est pas bonne.'})
        return
    }

    const userJwt = jwt.sign({email: user.email}, secret)

    res.json({ jwt: userJwt, user: user })

})

app.post('/inscription', function(req, res) {
    axios.post(ADDRESS+'/users', req.body, {headers : HEADER})
        .then(result => res.json("User ajouté"))
})
