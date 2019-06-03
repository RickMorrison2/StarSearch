import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Card, ListItem, Icon, CheckBox } from 'react-native-elements'

// const console = require('console');

let baseURL = 'https://rick-mvp-project.herokuapp.com'

export default class MovieSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: '',
      text2: '',
      resultsOpen: false,
      movie1ID: '',
      movie2ID: '',
      movie1Poster: '',
      movie2Poster: '',
      actors1: '',
      actors2: '',
      actors1Photos: '',
      actors2Photos: '',
      sharedActors: [],
      previousSearches: '',
      prevSearchesOpen: false,
      searching: 'Search'
    }
    this.getActorsMovie1 = this.getActorsMovie1.bind(this)
    this.getActorsMovie2 = this.getActorsMovie2.bind(this)
    this.searchDatabaseByName1 = this.searchDatabaseByName1.bind(this)
    this.searchDatabaseByName2 = this.searchDatabaseByName2.bind(this)
    this.compareActors = this.compareActors.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  searchDatabaseByName1(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=false`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        movie1ID: data.results[0].id,
        movie1Poster: data.results[0].poster_path
      })
      return data.results[0].id
    })
    .then(id => {
      this.getActorsMovie1(id)
      return id;
    })
    .catch(err => Alert.alert('Oops...', 'Could not find Movie 1. Did you spell the name correctly?'))
  }

    
  getActorsMovie1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let actors = {};
      let photos = {};
      for (let i = 0; i < credits.length; i++) {
        let actor = credits[i]['name']
        actors[actor] = 1
        photos[actor] = credits[i]['profile_path']
      }
      this.setState({
        actors1: actors,
        actors1Photos: photos
      }, this.searchDatabaseByName2(this.state.text2))
    })
  }

  searchDatabaseByName2(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=false`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        movie2ID: data.results[0].id,
        movie2Poster: data.results[0].poster_path
      })
      return data.results[0].id})
    .then(id => {
      this.getActorsMovie2(id)
      return id;
    })
    .catch(err => Alert.alert('Oops...', 'Could not find Movie 2. Did you spell the name correctly?'))
  }

    
  getActorsMovie2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}`)
    .then(result => result.json())
    .then(data => {
      let credits = data["cast"];
      let actors = {};
      let photos = {};
      for (let i = 0; i < credits.length; i++) {
        let actor = credits[i]['name']
        actors[actor] = 1
        photos[actor] = credits[i]['profile_path']
      }
      this.setState({
        actors2: actors,
        actors2Photos: photos
      }, () => this.compareActors())
    })
  }
    
  compareActors() {
    let sharedActors = [];
    if (this.state.actors1.length === 0) {
      Alert.alert('no actors1')
    }
    let actors1 = Object.keys(this.state.actors1);
    for (let i = 0; i < actors1.length; i++) {
      let actor = actors1[i];
      if (this.state.actors2[actor]) {
        sharedActors.push(actor);
      }
    }
    if (sharedActors.length === 0) {
      this.setState({
        sharedActors: ['No actors have been in these two movies']
      }, () => this.setState({
        resultsOpen: true
      }))
    } else {
      this.setState({
        sharedActors: sharedActors,
      }, () => this.setState({
        resultsOpen: true
      }))
    }
  }


  postSearch() {
    const body = {
      text1: this.state.text1,
      text2: this.state.text2,
      sharedActors: this.state.sharedActors
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch(`${baseURL}/movieSearches`, options)
    .then(res => res.json())
    .then(response => {
      Alert.alert('', response.message)
    })
    .catch((err) => Alert.alert('', err.message))
  }

  deleteSearch(id) {
    const body = {
      id: id
    }
    const options = {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch(`${baseURL}/movieSearches`, options)
    .then(res => res.json())
    .then(response => {
      Alert.alert('', response.message)
    })
    .catch((err) => Alert.alert('', err.message))
  }

  getSearches() {
    fetch(`${baseURL}/movieSearches`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        previousSearches: data
      }, () => this.setState({
        prevSearchesOpen: true
      }))
    })
  }
  
  handleSearch() {
    this.setState({
      searching: 'Searching...'
    }, this.searchDatabaseByName1(this.state.text1))
    // this.searchDatabaseByName2(this.state.text2)
  }
  
  
  render() {
    if (this.state.resultsOpen === false) {
      return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/FilmReel.jpg')} />
        <View style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: 170,
          marginBottom: '25%'
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
        width: '50%',
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
          initial={0}
          onPress={(value) => this.props.handleSearchTypeChange(value)}
          style={{color: 'white', fontSize: '24'}}
        />
      </View>
        <TextInput
          style={styles.input}
          placeholder="Movie 1"
          value={this.state.text1}
          onChangeText={async (text1) => await this.setState({text1})}
          />
        <TextInput
          style={styles.input}
          placeholder="Movie 2"
          value={this.state.text2}
          onChangeText={async (text2) => await this.setState({text2})}
          />
        <View>
        <Button
          onPress={this.handleSearch}
          title={this.state.searching}
          />
      </View>
      </View>
      </View>
      </TouchableWithoutFeedback>
  );
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/FilmReel.jpg')} />
    <View style={{
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
        <View style={{
          height: '35%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          flexDirection: 'row',
          paddingLeft: '5%'
        }}>
          <Image
          style={styles.moviePoster}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.movie1Poster}`}}
          />
          <Image
          style={styles.moviePoster}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.movie2Poster}`}}
          />
        </View>
          <View style={{
            height: '65%',
            paddingTop: 25,
            flex: 1
            }}>
          <ScrollView style={{
            flex: 1
          }}>
            <Card containerStyle={{padding: 3, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
              {
                this.state.sharedActors.map(actor => (
                  <View key={actor} style={styles.cardView}>
                    <Image
                    source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.actors1Photos[actor]}`}}
                    style={{
                      height: 100,
                      width: 70,
                      padding: 2,
                      margin: 2
                    }}
                    />
                    <Text key={actor} style={styles.cardText}>{actor}</Text>
                  </View>
                ))
              }
            </Card>
          </ScrollView>
          </View>
      </View>
      <View
      style={{
        padding: 5,
      }}
      >
        <Button 
          onPress={() => {
            this.setState({
              searching: 'Search',
              resultsOpen: false})
          }}
          title="Go Back"
          />  
      </View>
      {/* <View style={{
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
      </View>  */}
    </View>
  )
} else {
  return (
    <View
    style={styles.container}
    >
    <Image 
    style={styles.image}
    source={require('./assets/FilmReel.jpg')} />
    <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    }}
    >
      <View style={{
        flex: 1,
        paddingTop: 25,
        height: '75%'
      }}>
        <ScrollView>
        <Card title="Previous Searches" titleStyle={{color: 'white'}} containerStyle={{padding: 10, paddingBottom: 5, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 10}}>
          {
            this.state.previousSearches.map(search => {
                return (<View key={search._id} style={styles.cardView} >
                  <Text key={search._id} style={styles.cardText}>{JSON.stringify(search)}</Text>
                  <Button
                    onPress={() => this.deleteSearch(search._id)}
                    title="X"
                    />
                  {/* <Text>testing</Text> */}
                </View>)
              })
            }
        </Card>
        </ScrollView>
      </View>
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
    flexDirection: 'column',
    width: '100%'
  },
  image: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    height: '9%', 
    width: '50%', 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  cardView: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardText: {
    width: '70%',
    fontSize: 20,
    color: 'black',
    margin: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  moviePoster: {
    height: '100%',
    width: '37.5%',
    justifyContent: 'center'
    // padding: 10,
    // margin: 25
  }
});