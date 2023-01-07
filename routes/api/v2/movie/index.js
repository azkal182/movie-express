const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
  res.send('movie v2')
})


module.exports = router
