const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
  res.send('root api')
})
router.use('/v1', require("./v1"))
router.use('/v2', require("./v2"))


module.exports = router
