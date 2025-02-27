require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get('/', (req, res) => {
    res.status(200).render('index', {navbar:false});
});

app.get('/artist-search', (req, res) => {
    const {searchedArtist} = req.query;
    spotifyApi
        .searchArtists(searchedArtist)
        .then(data => {
            const searchResults = data.body.artists.items;
            res.status(200).render('artist-search-results', {searchResults, navbar:true});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res) => {
    spotifyApi.
        getArtistAlbums(req.params.id)
        .then(data => {
            const albums = data.body.items;
            res.status(200).render('artist-albums', {albums, navbar:true});
        })
        .catch(err => console.log('The error while loading albums occurred: ', err));
});

app.get('/tracks/:id', (req, res) => {
    spotifyApi.
        getAlbumTracks(req.params.id)
        .then(data => {
            const tracks = data.body.items;
            res.status(200).render('album-tracklist', {tracks, navbar:true});
        })
        .catch(err => console.log('The error while loading tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
