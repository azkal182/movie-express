const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
  res.send('tv v1')
})


module.exports = router
