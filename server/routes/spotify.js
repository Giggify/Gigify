var express = require('express')
var request = require('superagent')
const verifyJwt = require('express-jwt')
const auth = require('../lib/auth')

const router = express.Router()
const spotify = require('../lib/spotify')
const testMode = false

spotify.setConnection(testMode)

require('dotenv').config()

const url = 'https://api.spotify.com'

router.get('/artists/:artistId/toptracks', (req, res) => {
    request
    .get(`${url}/v1/artists/${req.params.artistId}/top-tracks?country=NZ`)
    .set('Authorization', `Bearer ${spotify.getConnection()}`)
    .set('Accept', 'application/json')
    .end((error, response) => {
      error ? res.send(error) : res.json(spotify.filterTracks(response.body.tracks))
    })
})

router.get('/artists/:artistId', (req, res) => {
  request
    .get(`${url}/v1/artists/${req.params.artistId}`)
    .set('Authorization', `Bearer ${spotify.getConnection()}`)
    .set('Accept', 'application/json')
    .end((error, response) => {
      error ? res.send(error) : res.json(response.body)
    })
})

router.get('/search/:searchStr', (req, res) => {
  request
    .get(`${url}/v1/search?q=${req.params.searchStr}&type=artist&limit=1`)
    .set('Authorization', `Bearer ${spotify.getConnection()}`)
    .set('Accept', 'application/json')
    .end((error, response) => {
      error ? res.send(error) : res.json(spotify.filterArtists(response.body.artists.items, req.params.searchStr))
    })
})

router.get('/users/:id', (req, res) => {
  request
    .get(`${url}/v1/users/${req.params.id}`)
    .set('Authorization', `Bearer ${spotify.getConnection()}`)
    .set('Accept', 'application/json')
    .end((error, response) => {
      error ? res.status(500).send(error) : res.json(response.body)
    })
})

// Protect all routes beneath this point
// console.log(auth.getSecret())

router.use(
  verifyJwt({
    getToken: auth.getToken,
    secret: auth.getSecret
  }),
  auth.handleError
)

// These routes are protected
router.post('/users/playlist', (req,res) => {
  request
  .post(`${url}/v1/users/${req.user.id}/playlists`)
  .send(req.body)
  .set('Authorization',  `Bearer ${req.user.accessToken}`)
  .set('Accept', 'application/json')
  .end((err,result) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log(result.body.id)
      res.status(201).send(result.body)

    }
  })
})


router.post('/users/playlist/:playlist_id/tracks', (req,res) => {
  console.log(req.body);
  request
    .post(`${url}/v1/users/${req.user.id}/playlists/${req.params.playlist_id}/tracks`)
    .send({
      "uris": req.body
    })
    .set('Authorization', `Bearer ${req.user.accessToken}`)
    .set('Accept', 'application/json')
    .end((err,result) => {
      if(err) {
        console.log(err);
      }
      else {
        res.sendStatus(201)
      }
    })
})

module.exports = router
