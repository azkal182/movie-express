const express = require('express')
const app = express()
const port = 3030
const cors = require("cors");
const responseTime = require('express-response-time')



app.use(responseTime((methond, url, time) => {
    console.log(`${methond} ${url}     (${time} ms)`)
}))
app.use(cors({ origin: true }));


const router = require('./routes')

app.use('/', router)
app.get('/user', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening on port localhost:${port}`)
})
