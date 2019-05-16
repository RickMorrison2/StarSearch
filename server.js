const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/searches';
const express = require('express');
// const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, './public')));

const db = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
});

db  
  .then(db => console.log(`Connected to: ${mongoURI}`))
  .catch(err => {
    console.log(`There was a problem connecting to mongo at: ${mongoURI}`)
    console.log(err);
  });

var Schema = mongoose.Schema;
var actorSearchSchema = new Schema({
  actor1: String,
  actor2: String,
  sharedMovies: String,
  sharedShows: String
})
var SearchModel = mongoose.model('SearchModel', searchSchema);

var movieSearchSchema = new Schema({
  actor1: String,
  actor2: String,
  sharedMovies: String,
  sharedShows: String
})
var SearchModel = mongoose.model('SearchModel', searchSchema);

var showSearchSchema = new Schema({
  actor1: String,
  actor2: String,
  sharedMovies: String,
  sharedShows: String
})
var SearchModel = mongoose.model('SearchModel', searchSchema);

const getSearches = () => {
  return SearchModel.find({}).exec();
};

  app.get('/', (req, res) => {
    res.json({
      message: "server running"
    })
  })

  app.get('/movieSearches', (req, res) => {
    getSearches()
      .then(search => res.json(search))
      // .then(console.log('got searches'))
      .catch(console.log)
  });

  app.post('/movieSearches', (req, res) => {
    console.log('hello');
    const movie1 = req.body.text1
    const movie2 = req.body.text2
    const { sharedActors } = req.body
    let newSchema = new movieSearchModel({
      movie1: movie1,
      movie2: movie2,
      sharedActors: sharedActors
    })
    newSchema.save()
    .then(newSearch => {
      res.json({
        message: 'Search has been saved!',
        newSearch: newSearch
      })
    })
    .catch(err => console.log(err))
      // res.sendStatus(201);
  })

  app.get('/actorSearches', (req, res) => {
    getSearches()
      .then(search => res.json(search))
      // .then(console.log('got searches'))
      .catch(console.log)
  });

  app.post('/actorSearches', (req, res) => {
    console.log('hello');
    const actor1 = req.body.text1
    const actor2 = req.body.text2
    const { sharedMovies, sharedShows } = req.body
    let newSchema = new actorSearchModel({
      actor1: actor1,
      actor2: actor2,
      sharedMovies: sharedMovies,
      sharedShows: sharedShows
    })
    newSchema.save()
    .then(newSearch => {
      res.json({
        message: 'Search has been saved!',
        newSearch: newSearch
      })
    })
    .catch(err => console.log(err))
      // res.sendStatus(201);
  })

  app.get('/showSearches', (req, res) => {
    getSearches()
      .then(search => res.json(search))
      // .then(console.log('got searches'))
      .catch(console.log)
  });

  app.post('/showSearches', (req, res) => {
    console.log('hello');
    const show1 = req.body.text1
    const show2 = req.body.text2
    const { sharedActors } = req.body
    let newSchema = new SearchModel({
      show1: show1,
      show2: show2,
      sharedActors: sharedActors
    })
    newSchema.save()
    .then(newSearch => {
      res.json({
        message: 'Search has been saved!',
        newSearch: newSearch
      })
    })
    .catch(err => console.log(err))
      // res.sendStatus(201);
  })


const port = process.env.PORT || 3001;
app.listen(port, () => console.log('listening on port ', port))