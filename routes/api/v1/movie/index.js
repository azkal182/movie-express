const express = require('express')
const router = express.Router()

const Movie = require('../../../../lib/movie.js')
const movie = new Movie()

router.get('/', async (req, res) => {
 const data = await movie.index()
  res.send({data})
})
router.get('/latest', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await movie.index('latest', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/top-today', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1

 const data = await movie.index('top-movie-today', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/popular', async (req, res) => {
 const page = req.query.page ? parseInt(req.query.page) : 1
 
 const data = await movie.index('popular', page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/country/:country', async (req, res) => {
 const params = req.params.country
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await movie.country(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/genre/:genre', async (req, res) => {
 const params = req.params.genre
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await movie.genre(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})

})

router.get('/year/:year', async (req, res) => {
 const params = req.params.year
 const page = req.query.page ? parseInt(req.query.page) : 1
 const data = await movie.year(params,page)
  res.send({message: 'success', perPgage: data.results.length,...data})
})

router.get('/detail/:id', async (req, res) => {
 const params = req.params.id
 
 const data = await movie.detail(params)
  res.send({message: 'success',...data})
})

router.get('/tes', async (req, res) => {
 
 
 const data = await movie.tes()
  res.send(data)
})

module.exports = router
