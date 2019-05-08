import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
const console = require('console');
// const imdb = require('imdb-api');
// const console = require('console');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: '',
      text2: '',
      resultsOpen: false,
      artist1ID: '',
      artist2ID: '',
      movies1: '',
      movies2: '',
      shows1: '',
      shows2: '',
      sharedMovies: 'Loading...',
      sharedShows: 'Loading...',
      previousSearches: '',
      prevSearchesOpen: false,
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
    // .then(id => {
    //   this.getShowsID1(id)
    // })
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
        // resultsOpen: true
      }, () => this.getShowsID1(id))
      // this.getShowsID1(id)
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
      return data.results[0].id})
    .then(id => {
      this.getMoviesID2(id)
      return id;
    })
    // .then(id => {
    //   this.getShowsID2(id)
    // })
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
        // resultsOpen: true
      }, () => this.getShowsID2(id))
    })
    // .then(this.compareMovies())
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
        // resultsOpen: true
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
        // resultsOpen: true
      }, () => this.compareMovies())
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
    if (sharedMovies.length === 0) {
      this.setState({
        sharedMovies: 'none'
      }, () => this.compareShows())
    } else {
      this.setState({
        sharedMovies: sharedMovies.join(', ')
      }, () => this.compareShows())
    }
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
    if (sharedShows.length === 0) {
      this.setState({
        sharedShows: 'none',
        resultsOpen: true
      })
    } else {
      this.setState({
        sharedShows: sharedShows.join(', '),
        resultsOpen: true
      })
    }
  }

  postSearch() {
    const body = {
      text1: this.state.text1,
      text2: this.state.text2,
      sharedMovies: this.state.sharedMovies,
      sharedShows: this.state.sharedShows
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch('http://10.6.66.46:3001/searches', options)
    // .then(res => res.json())
    .then(Alert.alert('', 'Search saved!'))
    // .catch((err) => Alert.alert('Error', JSON.stringify(err)))
  }

  getSearches() {
    fetch('http://10.6.66.46:3001/searches')
    .then(res => res.json())
    .then(data => {
      this.setState({
        previousSearches: data
      })
    })
    .then(this.setState({
      prevSearchesOpen: true
    }))
    // .catch((err) => Alert.alert('Error', JSON.stringify(err)))
  }

  handleSearch(state) {
    this.searchDatabaseByName1(state.text1)
    this.searchDatabaseByName2(state.text2)
    this.setState({
      resultsOpen: true
    })
  }

  render() {
    if (this.state.resultsOpen === false) {
      return (
        <View style={styles.container}>
        <Image 
          style={{
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
          source={require('./assets/Starsinthesky.jpg')} />
          <Text style={{
            fontSize: 30, 
            color: 'white',
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            margin: 5,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: 'rgba(0,0,0,0.5)'
            }}>Star Search</Text>
          <TextInput
            style={{
              height: 50, 
              width: 200, 
              borderColor: 'gray', 
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              margin: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}
            placeholder="Actor 1"
            value={this.state.text1}
            onChangeText={async (text1) => await this.setState({text1})}
            />
          <TextInput
            style={{
              height: 50, 
              width: 200, 
              borderColor: 'gray', 
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              margin: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}
            placeholder="Actor 2"
            value={this.state.text2}
            onChangeText={async (text2) => await this.setState({text2})}
            />
          <Button
            onPress={() => this.handleSearch(this.state)}
            title="Search"
            />
        </View>
    );
  } else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false) {
    return (
      <View style={styles.container}>
        <Image 
          style={{
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
          source={require('./assets/Starsinthesky.jpg')} />
        <Text style={{
          fontSize: 24,
          color: 'white',
          padding: 5,
          // flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          shadowColor: 'black'
        }}>{`${this.state.text1} and ${this.state.text2} have both been in: `}  
              <Text style={{
                fontSize: 24,
                color: 'white',
                padding: 5,
                // flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>{`
              Movies: ${this.state.sharedMovies}
              TV Shows: ${this.state.sharedShows}
              `}
              </Text>
        </Text>
        <View
        style={{
          padding: 5,
        }}
        >
          <Button 
            onPress={() => {
              this.setState({resultsOpen: false})
            }}
            title="Go Back"
            />  
        </View>
        <View style={{
          padding: 5,
        }}>
          <Button
            onPress={() => {
              this.postSearch()
            }}
            title="Save Search"
            />
        </View>
        <View
        style={{
          padding: 5,
        }}>
          <Button
            onPress={() => {
              this.getSearches()
            }}
            title="Previous Searches"
            />
        </View> 
      </View>
    )
  } else {
    return (
      <View
      style={styles.container}
      >
      <Image 
      style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    source={require('./assets/Starsinthesky.jpg')} />
      <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 5,
      }}
      >
      <Text>Previous Searches:
        {`${this.state.previousSearches}`}
      </Text>
        <Button 
          onPress={() => {
            this.setState({prevSearchesOpen: false})
          }}
          title="Go Back"
          />  
        </View>
      </View>
    )
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
});
