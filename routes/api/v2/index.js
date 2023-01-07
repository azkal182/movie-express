const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('root v2')
})
router.use('/movie', require("./movie"))
router.use('/tv', require("./tv"))


module.exports = router
