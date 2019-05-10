const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/searches';
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

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
var SearchModel = mongoose.model('SearchModel', searchSchema);

  app.get('/', (req, res) => {
    res.json({
      message: "server running"
    })
  })

  app.get('/searches', (req, res) => {
    getSearches()
      .then(search => res.json(search))
      // .then(console.log('got searches'))
      .catch(console.log)
  });

  app.post('/searches', (req, res) => {
    const actor1 = req.body.text1
    const actor2 = req.body.text2
    const { sharedMovies, sharedShows } = req.body
    let newSchema = new SearchModel({
      actor1: actor1,
      actor2: actor2,
      sharedMovies: sharedMovies,
      sharedShows: sharedShows
    })
    newSchema.save((err) => console.log(err));
      res.sendStatus(201);
  })

let Searches = mongoose.model('searches', searchSchema);
const getSearches = () => {
  // return Artists.findById(id, 'name header_img -id').exec();
  return Searches.find({}).exec();
};

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('listening on port ', port))