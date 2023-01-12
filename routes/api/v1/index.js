const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('root v1')
})
router.use('/movie', require("./movie"))
router.use('/tv', require("./tv"))
router.use('/search', require("./search"))


module.exports = router
