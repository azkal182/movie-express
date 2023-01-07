const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('root router')
})

const api = require("./api");
//router.use('api', api)
router.use('/api', require("./api"))


module.exports = router
