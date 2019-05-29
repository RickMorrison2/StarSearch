import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Card, ListItem, Icon, CheckBox } from 'react-native-elements'

// const console = require('console');

let baseURL = 'https://rick-mvp-project.herokuapp.com'

export default class TVSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: '',
      text2: '',
      resultsOpen: false,
      show1ID: '',
      show2ID: '',
      show1Poster: '',
      show2Poster: '',
      actors1: '',
      actors2: '',
      actors1Photos: '',
      actors2Photos: '',
      sharedActors: [],
      previousSearches: '',
      prevSearchesOpen: false,
      adult: false
    }
    this.getActorsShow1 = this.getActorsShow1.bind(this)
    this.getActorsShow2 = this.getActorsShow2.bind(this)
    this.searchDatabaseByName1 = this.searchDatabaseByName1.bind(this)
    this.searchDatabaseByName2 = this.searchDatabaseByName2.bind(this)
    this.compareActors = this.compareActors.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  searchDatabaseByName1(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=${this.state.adult}`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        show1ID: data.results[0].id,
        show1Poster: data.results[0].poster_path
      })
      return data.results[0].id
    })
    .then(id => {
      this.getActorsShow1(id)
      return id;
    })
  }

    
  getActorsShow1(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${key}`)
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
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=${this.state.adult}`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        show2ID: data.results[0].id,
        show2Poster: data.results[0].poster_path
      })
      return data.results[0].id})
    .then(id => {
      this.getActorsShow2(id)
      return id;
    })
  }

    
  getActorsShow2(id) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${key}`)
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
      Alert.alert('No Actors Found for Show 1')
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
        sharedActors: ['none']
      }, () => this.setState({
        resultsOpen: true
      }))
    } else {
      this.setState({
        sharedActors: sharedActors
      }, () => this.setState({
        resultsOpen: true
      }))
    }
  }


  postSearch() {
    const body = {
      text1: this.state.text1,
      text2: this.state.text2,
      sharedActors: this.state.shareActors
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch(`${baseURL}/showSearches`, options)
    .then(res => res.json())
    .then(response => {
      Alert.alert('', response.message)
    })
    .catch((err) => Alert.alert('', err.message))
  }

  getSearches() {
    fetch(`${baseURL}/showSearches`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        previousSearches: data
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

  render() {
    if (this.state.resultsOpen === false) {
    return (
      <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={require('./assets/FilmReel.jpg')} />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: 170,
          marginBottom: 200
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
          initial={2}
          onPress={(value) => this.props.handleSearchTypeChange(value)}
          style={{color: 'white', fontSize: '24'}}
        />
      </View>
        <TextInput
          style={styles.input}
          placeholder="Show 1"
          value={this.state.text1}
          onChangeText={async (text1) => await this.setState({text1})}
          />
        <TextInput
          style={styles.input}
          placeholder="Show 2"
          value={this.state.text2}
          onChangeText={async (text2) => await this.setState({text2})}
          />
        <View>
        <Button
          onPress={this.handleSearch}
          title="Search"
          />
          </View>
        </View>
      </View>
  );
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        // source={require('./assets/Starsinthesky.jpg')} />
        source={require('./assets/FilmReel.jpg')} />
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
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          // margin: 25
        }}>
          {/* <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text1}
          </Text> */}
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 25
          }}
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.show1Poster}`}}
          />
          </View>
          <View style={{
          direction: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 25,
          paddingLeft: 60
        }}>
          {/* <Text style={{
            fontSize: 20,
            color: 'white'
          }}>
            {this.state.text2}
          </Text> */}
          <Image
          style={{
            height: 200,
            width: 140,
            justifyContent: 'center'
            // padding: 10,
            // margin: 50
          }}          
          source={{uri: `https://image.tmdb.org/t/p/w1280${this.state.show2Poster}`}}
          />
        </View>
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
      <View style={{
        direction: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
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
      </View> */}
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
    source={require('./assets/FilmReel.jpg')} />
    <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    }}
    >
      <View>
        <Card title="Previous Searches">
          {
            this.state.previousSearches.map(search => {
              <View key={search} style={styles.cardView} >
                <Text key={search} style={styles.cardText}>{search}</Text>
              </View>
            })
          }
        </Card>
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
  }
});