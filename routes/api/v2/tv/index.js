const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
  res.send('tv v2')
})


module.exports = router
