const express = require('express')
const router = express.Router()
const Tv = require('../../../../lib/tv.js')
const serial = new Tv()

router.get('/', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await serial.index('latest', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})
router.get('/latest', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await serial.index('latest', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/top-today', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await serial.index('top-movie-today', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/popular', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await serial.index('popular', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})


router.get('/series/:series', async (req, res) => {
 const params = req.params.series
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await serial.series(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/country/:country', async (req, res) => {
 let params = req.params.country
 if (params === 'korea') {
    params = 'south-korea'
 }
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await serial.country(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/genre/:genre', async (req, res) => {
 const params = req.params.genre
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await serial.genre(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})

})

router.get('/year/:year', async (req, res) => {
 const params = req.params.year
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await serial.year(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/detail/:id', async (req, res) => {
 const id = req.params.id

 const data = await serial.detail(id)
  res.send({status: 'success', results:{...data}})
})

router.get('/show/:id', async (req, res) => {
 const id = req.params.id
 const data = await serial.show(id)
  res.send({status: 'success',...data})
})


module.exports = router
