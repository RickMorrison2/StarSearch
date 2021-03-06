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
var searchSchema = new Schema({
  actor1: String,
  actor2: String,
  sharedMovies: String,
  sharedShows: String
})
var SearchModel = mongoose.model('SearchModel', searchSchema)

var actorSearchSchema = new Schema({
  actor1: String,
  actor2: String,
  sharedMovies: String,
  sharedShows: String
})
var ActorSearchModel = mongoose.model('ActorSearchModel', actorSearchSchema);

var movieSearchSchema = new Schema({
  movie1: String,
  movie2: String,
  sharedActors: String
})
var MovieSearchModel = mongoose.model('MovieSearchModel', movieSearchSchema);

var showSearchSchema = new Schema({
  show1: String,
  show2: String,
  sharedActors: String
})
var ShowSearchModel = mongoose.model('ShowSearchModel', showSearchSchema);

const getSearches = () => {
  return SearchModel.find({}).exec();
};

const getMovieSearches = () => {
  return MovieSearchModel.find({}).exec();
};

const deleteMovieSearch = (_id) => {
  return MovieSearchModel.deleteOne({_id: _id}).exec();
}

const getActorSearches = () => {
  return ActorSearchModel.find({}).exec();
};

const getShowSearches = () => {
  return ShowSearchModel.find({}).exec();
};

  app.get('/', (req, res) => {
    res.json({
      message: "server running"
    })
  })

  app.get('/movieSearches', (req, res) => {
    getMovieSearches()
      .then(search => res.json(search))
      .catch(console.log)
  });

  app.post('/movieSearches', (req, res) => {
    const movie1 = req.body.text1
    const movie2 = req.body.text2
    const { sharedActors } = req.body
    let newSchema = new MovieSearchModel({
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
  })

  app.delete('/movieSearches/:_id', (req, res) => {
    const { _id } = req.params
    deleteMovieSearch(_id)
    .then(res => res.json())
    .catch(console.log)
  })

  app.get('/actorSearches', (req, res) => {
    getActorSearches()
      .then(search => res.json(search))
      .catch(console.log)
  });

  app.post('/actorSearches', (req, res) => {
    console.log('hello');
    const actor1 = req.body.text1
    const actor2 = req.body.text2
    const { sharedMovies, sharedShows } = req.body
    let newSchema = new ActorSearchModel({
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
    getShowSearches()
      .then(search => res.json(search))
      // .then(console.log('got searches'))
      .catch(console.log)
  });

  app.post('/showSearches', (req, res) => {
    console.log('hello');
    const show1 = req.body.text1
    const show2 = req.body.text2
    const { sharedActors } = req.body
    let newSchema = new ShowSearchModel({
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