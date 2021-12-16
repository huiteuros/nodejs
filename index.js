const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important

app.get('/', function (req, res) {
  res.send('Home page')
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

const axios = require('axios');

app.get('/plats', function (req, res) {
  axios.get('https://tpnotenodejsaxellebg-46db.restdb.io/rest/plats', { 
  headers: 
   { 'cache-control': 'no-cache',
     'x-apikey': 'fb59b6db4a85575897bbf2f4e44772075146f' } 
   })
  .then(result => res.json(result.data))
})

app.get('/plats/:id', function (req, res) {
    axios.get('https://tpnotenodejsaxellebg-46db.restdb.io/rest/plats'+res.id, { 
    headers: 
     { 'cache-control': 'no-cache',
       'x-apikey': 'fb59b6db4a85575897bbf2f4e44772075146f' } 
     })
    .then(result => res.json(result.data))
  })

