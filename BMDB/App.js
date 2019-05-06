import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image} from 'react-native';
// const imdb = require('imdb-api');
const console = require('console');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: '',
      text2: '',
      resultsOpen: false,
      artist1ID: '',
      artist2ID: '',
      artist1Name: '',
      artist2Name: '',
      movies1: '',
      movies2: '',
      shows1: '',
      shows2: '',
      sharedMovies: 'none',
      sharedShows: 'none'
    }
    this.getMoviesID1 = this.getMoviesID1.bind(this)
    this.getMoviesID2 = this.getMoviesID2.bind(this)
    this.searchDatabaseByName1 = this.searchDatabaseByName1.bind(this)
    this.searchDatabaseByName2 = this.searchDatabaseByName2.bind(this)
    this.getShowsID1 = this.getShowsID1.bind(this)
    this.getShowsID2 = this.getShowsID2.bind(this)
    this.compareMovies = this.compareMovies.bind(this)
    this.compareShows = this.compareShows.bind(this)
  }

  searchDatabaseByName1(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/person?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=false`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        artist1ID: data.results[0].id
      })
      return data.results[0].id
    })
    .then(id => {
      this.getMoviesID1(id)
      return id;
    })
    .then(id => {
      this.getShowsID1(id)
    })
  }

    
  getMoviesID1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let movies = {};
      for (let i = 0; i < credits.length; i++) {
        movies[credits[i]['title']] = 1
      }
      this.setState({
        movies1: movies,
        resultsOpen: true
      })
    })
  }

  searchDatabaseByName2(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/person?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=false`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        artist2ID: data.results[0].id
      })
      this.getMoviesID2(data.results[0].id)
      this.getShowsID2(data.results[0].id)
    })
  }

    
  getMoviesID2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let movies = {};
      for (let i = 0; i < credits.length; i++) {
        movies[credits[i]['title']] = 1
      }
      this.setState({
        movies2: movies,
        resultsOpen: true
      })
      this.compareMovies();
    })
  }
    
  getShowsID1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let shows = {};
      for (let i = 0; i < credits.length; i++) {
        shows[credits[i]['name']] = 1
      }
      this.setState({
        shows1: shows,
        resultsOpen: true
      })
    })
  }
    
  getShowsID2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let shows = {};
      for (let i = 0; i < credits.length; i++) {
        shows[credits[i]['name']] = 1
      }
      this.setState({
        shows2: shows,
        resultsOpen: true
      })
      this.compareShows()
    })
  }

  compareMovies() {
    let sharedMovies = [];
    let movies1 = Object.keys(this.state.movies1);
    for (let i = 0; i < movies1.length; i++) {
      let movie = movies1[i];
      if (this.state.movies2[movie]) {
        sharedMovies.push(movie);
      }
    }
    this.setState({
      sharedMovies: sharedMovies.join(', ')
    })
  }

  compareShows() {
    let sharedShows = [];
    let shows1 = Object.keys(this.state.shows1);
    for (let i = 0; i < shows1.length; i++) {
      let show = shows1[i];
      if (this.state.shows2[show]) {
        sharedShows.push(show);
      }
    }
    this.setState({
      sharedShows: sharedShows.join(', ')
    })
  }

  render() {
    if (this.state.resultsOpen === false) {
      return (
        <View style={styles.container}>
        {/* <Image 
          style={{
            flex: 1
          }}
          source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Starsinthesky.jpg/2880px-Starsinthesky.jpg'}}> */}
        <Text style={{fontSize: 18}}>StarSearch</Text>
        <TextInput
          style={{
            height: 50, 
            width: 200, 
            borderColor: 'black', 
            borderWidth: 1,
            padding: 10,
            margin: 5
          }}
          placeholder={this.state.artist1Name}
          onChangeText={(text1) => this.setState({text1})}
          />
        <TextInput
          style={{
            height: 50, 
            width: 200, 
            borderColor: 'black', 
            borderWidth: 1,
            padding: 10,
            margin: 5
          }}
          placeholder={this.state.artist2Name}
          onChangeText={(text2) => this.setState({text2})}
          />
        <Button
          onPress={() => {
            this.searchDatabaseByName1(this.state.text1)
            this.searchDatabaseByName2(this.state.text2)
          }}
          title="Search"
          />
      {/* </Image> */}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Here are your results:  
            <Text>{`
              Movies:
              ${this.state.sharedMovies}
              TV Shows:
              ${this.state.sharedShows}
            `}
            </Text>
          </Text>
        <Button 
          onPress={() => {
            this.setState({resultsOpen: false})
          }}
          title="Go Back"
        />
      </View>
    )
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
