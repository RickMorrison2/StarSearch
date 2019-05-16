import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Card, ListItem, Icon, CheckBox } from 'react-native-elements'


let baseURL = 'https://rick-mvp-project.herokuapp.com'
// let baseURL = 'http://10.0.75.1:3001'

export default class ActorSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: '',
      text2: '',
      resultsOpen: false,
      actor1ID: '',
      actor2ID: '',
      actor1Photo: '',
      actor2Photo: '',
      movies1: '',
      movies2: '',
      movie1Poster: '',
      movie2Poster: '',
      shows1: '',
      shows2: '',
      show1Poster: '',
      show2Poster: '',
      sharedMovies: [],
      sharedShows: [],
      previousSearches: '',
      prevSearchesOpen: false,
      adult: false
    }
    this.getMoviesID1 = this.getMoviesID1.bind(this)
    this.getMoviesID2 = this.getMoviesID2.bind(this)
    this.searchDatabaseByName1 = this.searchDatabaseByName1.bind(this)
    this.searchDatabaseByName2 = this.searchDatabaseByName2.bind(this)
    this.getShowsID1 = this.getShowsID1.bind(this)
    this.getShowsID2 = this.getShowsID2.bind(this)
    this.compareMovies = this.compareMovies.bind(this)
    this.compareShows = this.compareShows.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  searchDatabaseByName1(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/person?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=${this.state.adult}`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        actor1ID: data.results[0].id,
        actor1Photo: data.results[0].profile_path
      })
      return data.results[0].id
    })
    .then(id => {
      this.getMoviesID1(id)
      return id;
    })
  }

    
  getMoviesID1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let movies = {};
      let posters = {};
      for (let i = 0; i < credits.length; i++) {
        let movie = credits[i]['title']
        movies[movie] = 1
        posters[movie] = credits[i]['poster_path']
      }
      this.setState({
        movies1: movies,
        movie1Poster: posters
      }, () => this.getShowsID1(id))
    })
  }

  searchDatabaseByName2(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/person?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=${this.state.adult}`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        actor2ID: data.results[0].id,
        actor2Photo: data.results[0].profile_path
      })
      return data.results[0].id})
    .then(id => {
      this.getMoviesID2(id)
      return id;
    })
  }

    
  getMoviesID2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let movies = {};
      let posters = {};
      for (let i = 0; i < credits.length; i++) {
        let movie = credits[i]['title']
        movies[movie] = 1
        posters[movie] = credits[i]['poster_path']
      }
      this.setState({
        movies2: movies,
      }, () => this.getShowsID2(id))
    })
  }
    
  getShowsID1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let shows = {};
      let posters = {};
      for (let i = 0; i < credits.length; i++) {
        let show = credits[i]['name']
        shows[show] = 1
        posters[show] = credits[i]['poster_path']
      }
      this.setState({
        shows1: shows,
        show1Poster: posters
      }, () => this.searchDatabaseByName2(this.state.text2))
    })
  }
    
  getShowsID2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let shows = {};
      let posters = {};
      for (let i = 0; i < credits.length; i++) {
        let show = credits[i]['name']
        shows[show] = 1
        posters[show] = credits[i]['poster_path']
      }
      this.setState({
        shows2: shows,
        show2Poster: posters
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
        sharedMovies: []
      }, () => this.compareShows())
    } else {
      this.setState({
        sharedMovies: sharedMovies
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
          sharedShows: []
        }, () => this.setState({
          resultsOpen: true
        }))
      } else {
        this.setState({
          sharedShows: sharedShows
        }, () => this.setState({
          resultsOpen: true
        }))
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
    fetch(`${baseURL}/actorSearches`, options)
    .then(res => res.json())
    .then(response => {
      Alert.alert('', response.message)
    })
    .catch((err) => Alert.alert('', err.message))
  }

  getSearches() {
    fetch(`${baseURL}/actorSearches`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        previousSearches: JSON.stringify(data)
      })
    })
    .then(this.setState({
      prevSearchesOpen: true
    }))
  }

  handleSearch() {
    this.searchDatabaseByName1(this.state.text1)
    // this.searchDatabaseByName2(this.state.text2)
  }

  handleAdultCheck() {
    if (this.state.adult === true) {
      this.setState({
      adult: false
    })
  } else {
    this.setState({
      adult: true
    })
  }
}

  render() {
    if (this.state.resultsOpen === false) {
    return (
      <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 170
        }}>
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
      <Text style={{
        fontSize: 22,
        color: 'white'
      }}>Select your search type:</Text>
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: 200,
        justifyContent: 'center',
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        margin: 5
      }}>
        <RadioForm
          radio_props={[
            {label: 'Movies', value: 1},
            {label: 'Actors', value: 2},
            {label: 'TV Shows', value: 3}
          ]}
          initial={1}
          onPress={(value) => this.props.handleSearchTypeChange(value)}
          style={{color: 'white', fontSize: '24'}}
        />
      </View>
        <TextInput
          style={styles.input}
          placeholder="Actor 1"
          value={this.state.text1}
          onChangeText={async (text1) => await this.setState({text1})}
          />
        <TextInput
          style={styles.input}
          placeholder="Actor 2"
          value={this.state.text2}
          onChangeText={async (text2) => await this.setState({text2})}
          />
        <View>
        <Button
          onPress={this.handleSearch}
          title="Search"
          />
          </View>
          <View style={styles.checkBox}>
        <CheckBox
          center
          // checkedIcon='dot-circle-o'
          // uncheckedIcon='circle-o'
          title="Allow adult content"
          checked={this.state.adult}
          onPress={() => this.handleAdultCheck()}
        />
        </View>
        </View>
      </View>
  );
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false && this.state.sharedShows.length === 0) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
    <View style={{
      // padding: 25,
      // margin: 10,
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <View style={{
        height: 200,
        width: 350,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 8
      }}>
        <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: 25
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text1}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor1Photo}`}}
          />
          </View>
          <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          paddingLeft: 60
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text2}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor2Photo}`}}
          />
          </View>
        </View>
          <View style={{
            paddingTop: 25,
            height: '65%',
            flex: 1}}>
          <ScrollView style={{
            flex: 1
          }}>
            <Card title="Movies" titleStyle={{color: 'white'}} containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedMovies.map(movie => (
                  <View key={movie} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.movie1Poster[movie]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={movie} style={styles.cardText}>{movie}</Text>
                  </View>
                ))
              }
            </Card>
          </ScrollView>
          </View>
      </View>
      <View style={{
        direction: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <View
      style={{
        padding: 5,
        // width: '50%'
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
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around'
      }}>
        <Button
          onPress={() => {
            this.postSearch()
          }}
          title="Save Search"
          />
        <Button
          onPress={() => {
            this.getSearches()
          }}
          title="Previous Searches"
          />
      </View> 
      </View>
    </View>
  )
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false && this.state.sharedShows.length !== 0 && this.state.sharedMovies.length !== 0) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
    <View style={{
      // padding: 25,
      // margin: 10,
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <View style={{
        height: 200,
        width: 350,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 8
      }}>
        <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: 25
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text1}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor1Photo}`}}
          />
          </View>
          <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          paddingLeft: 60
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text2}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor2Photo}`}}
          />
          </View>
        </View>
          <View style={{
            paddingTop: 25,
            height: '65%',
            flex: 1}}>
          <ScrollView style={{
            flex: 1
          }}>
            <Card title="Movies" titleStyle={{color: 'white'}} containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedMovies.map(movie => (
                  <View key={movie} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.movie1Poster[movie]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={movie} style={styles.cardText}>{movie}</Text>
                  </View>
                ))
              }
            </Card>
            <Card title="TV Shows" titleStyle={{color: 'white'}} containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedShows.map(show => (
                  <View key={show} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.show1Poster[show]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={show} style={styles.cardText}>{show}</Text>
                  </View>
                ))
              }
            </Card>
          </ScrollView>
          </View>
      </View>
      <View style={{
        direction: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <View
      style={{
        padding: 5,
        // width: '50%'
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
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around'
      }}>
        <Button
          onPress={() => {
            this.postSearch()
          }}
          title="Save Search"
          />
        <Button
          onPress={() => {
            this.getSearches()
          }}
          title="Previous Searches"
          />
      </View> 
      </View>
    </View>
  )
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false && this.state.sharedMovies.length === 0) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
    <View style={{
      // padding: 25,
      // margin: 10,
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <View style={{
        height: 200,
        width: 350,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 8
      }}>
        <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: 25
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text1}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor1Photo}`}}
          />
          </View>
          <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          paddingLeft: 60
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text2}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor2Photo}`}}
          />
          </View>
        </View>
          <View style={{
            paddingTop: 25,
            height: '65%',
            flex: 1}}>
          <ScrollView style={{
            flex: 1
          }}>
            <Card title="TV Shows" titleStyle={{color: 'white'}} containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedShows.map(show => (
                  <View key={show} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.show1Poster[show]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={show} style={styles.cardText}>{show}</Text>
                  </View>
                ))
              }
            </Card>
          </ScrollView>
          </View>
      </View>
      <View style={{
        direction: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <View
      style={{
        padding: 5,
        // width: '50%'
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
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around'
      }}>
        <Button
          onPress={() => {
            this.postSearch()
          }}
          title="Save Search"
          />
        <Button
          onPress={() => {
            this.getSearches()
          }}
          title="Previous Searches"
          />
      </View> 
      </View>
    </View>
  )
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false && this.state.adult === true) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
    <View style={{
      // padding: 25,
      // margin: 10,
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <View style={{
        height: 200,
        width: 350,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 8
      }}>
        <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: 25
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text1}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor1Photo}`}}
          />
          </View>
          <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          paddingLeft: 60
        }}>
          <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text2}
          </Text>
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actor2Photo}`}}
          />
          </View>
        </View>
          <View style={{
            paddingTop: 25,
            height: '65%',
            flex: 1}}>
          <ScrollView style={{
            flex: 1
          }}>
            <Card title="Movies" titleStyle={{color: 'white'}} containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedMovies.map(movie => (
                  <View key={movie} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.movie1Poster[movie]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={movie} style={styles.cardText}>{movie}</Text>
                  </View>
                ))
              }
            </Card>
          </ScrollView>
          </View>
      </View>
      <View style={{
        direction: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <View
      style={{
        padding: 5,
        // width: '50%'
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
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around'
      }}>
        <Button
          onPress={() => {
            this.postSearch()
          }}
          title="Save Search"
          />
        <Button
          onPress={() => {
            this.getSearches()
          }}
          title="Previous Searches"
          />
      </View> 
      </View>
    </View>
  )
} else {
  return (
    <View
    style={styles.container}
    >
    <Image 
    style={styles.image}
    // source={require('./assets/Starsinthesky.jpg')} />
    source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
    <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  image: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    height: 50, 
    width: 200, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  cardView: {
    // padding: 10,
    // margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  cardText: {
    width: '70%',
    fontSize: 20,
    color: 'black',
    // padding: 10,
    margin: 10,
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkBox: {
    marginTop: 195
  }
});