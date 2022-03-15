const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important
const HEADER = { 'cache-control': 'no-cache', 'x-apikey': 'fb59b6db4a85575897bbf2f4e44772075146f' }
const ADDRESS = 'https://tpnotenodejsaxellebg-46db.restdb.io/rest'
const cors = require('cors')

app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    cors(),
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
