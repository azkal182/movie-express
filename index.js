const express = require('express')
const app = express()
const port = 3030
/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/

const router = require('./routes')
const movie1 = require('./routes/api/v1/movie')
//const router = require('./routes')


//app.get('/', movie1)
app.use('/', router)
app.get('/user', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
	console.log(`Example app listening on port localhost:${port}`)
})
