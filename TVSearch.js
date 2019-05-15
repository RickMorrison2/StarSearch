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
      actors1: '',
      actors2: '',
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
        movie1ID: data.results[0].id
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
      for (let i = 0; i < credits.length; i++) {
        actors[credits[i]['name']] = 1
      }
      this.setState({
        actors1: actors,
      }, this.searchDatabaseByName2(this.state.text2))
    })
  }

  searchDatabaseByName2(text) {
    let key = 'b8127ddc3f4de9e8da7653f329851b5e'
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&query=${text}&page=1&include_adult=${this.state.adult}`)
    .then(result => result.json())
    .then(data => {
      this.setState({
        movie2ID: data.results[0].id
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
      for (let i = 0; i < credits.length; i++) {
        actors[credits[i]['name']] = 1
      }
      this.setState({
        actors2: actors
      }, () => this.compareActors())
    })
  }
    
  compareActors() {
    let sharedActors = [];
    if (this.state.actors1.length === 0) {
      Alert.alert('no actors1')
    }
    let actors1 = Object.keys(this.state.actors1);
    // Alert.alert('actors1', JSON.stringify(actors1))
    // Alert.alert('actors2', JSON.stringify(this.state.actors2))
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
      // }) () => Alert.alert('actor comparison', JSON.stringify(this.state)))
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
    fetch(`${baseURL}/searches`, options)
    .then(res => res.json())
    .then(response => {
      Alert.alert('', response.message)
    })
    .catch((err) => Alert.alert('', err.message))
  }

  getSearches() {
    fetch(`${baseURL}/searches`)
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

  handleAdultCheck() {
    this.setState({
      adult: !this.state.adult
    })
  }

  render() {
    if (this.state.resultsOpen === false) {
    return (
      <View style={styles.container}>
      <Image 
        style={styles.image}
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
      <Text style={{
        fontSize: 22,
        color: 'white'
      }}>Select your search type:</Text>
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
        <CheckBox
          center
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          title="Allow adult content"
          checked={this.state.adult}
        />
        </View>
      </View>
  );
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/Starsinthesky.jpg')} />
    <View style={{
      padding: 25,
      margin: 10,
      height: '82%'
    }}>
      <Text style={{
        fontSize: 24,
        color: 'white',
        padding: 5,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        shadowColor: 'black'
      }}>{`These actors have been in both ${this.state.text1} and ${this.state.text2}: `}  
          </Text>
          <View style={{height: '78%'}}>
          <ScrollView>
            <Card containerStyle={{padding: 5, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
              {
                this.state.sharedActors.map(actor => (
                  <View key={actor} style={styles.card}>
                    <Text key={actor}>{actor}</Text>
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
    style={styles.image}
    source={require('./assets/Starsinthesky.jpg')} />
    <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      padding: 5,
    }}
    >
      <View>
        <Card title="Previous Searches">
          {
            this.state.previousSearches.map(search => {
              <View key={search} style={styles.card} >
                <Text key={search}>{search}</Text>
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
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
  card: {
    fontSize: 24,
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
});