var express = require('express')
var app = express()

// Static serve dist directory on root
app.use('/', express.static('src'))

app.listen(3000)