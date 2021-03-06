var server = require('./server')
require('dotenv').config()

var environment = process.env.NODE_ENV || 'development'
var dbConfig = require('../knexfile')[environment]
var connection = require('knex')(dbConfig)

var app = server(connection)

var PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log('Listening on port', PORT)
})
