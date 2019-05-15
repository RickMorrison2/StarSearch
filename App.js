import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import ActorSearch from 'app/ActorSearch';
import MovieSearch from 'app/MovieSearch';
import TVSearch from 'app/TVSearch';

const console = require('console');
// const imdb = require('imdb-api');
// const console = require('console');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: 0
    }
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this)
  }

  handleSearchTypeChange(value) {
    this.setState({
      searchType: value
    })
  }

  render() {
    if (this.state.searchType === 0) {
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
        // source={require('./assets/Starsinthesky.jpg')} />
        source={{uri: 'https://ak.picdn.net/shutterstock/videos/1581349/thumb/1.jpg'}} />
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
        onPress={(value) => {this.setState({searchType: value})}}
        style={{color: 'white', fontSize: '24'}}
       />
    </View>
    )
  } else if (this.state.searchType === 1) {
    return (
      <View style={styles.container}>
        <MovieSearch
        handleSearchTypeChange={(value) => this.handleSearchTypeChange(value)}
        />
      </View>
    )
  } else if (this.state.searchType === 2) {
    return (
    <View style={styles.container}> 
        <ActorSearch
        handleSearchTypeChange={(value) => this.handleSearchTypeChange(value)}
        />
      </View>
    )
  } else if (this.state.searchType === 3) {
    return (
      <View style={styles.container}>
        <TVSearch
        handleSearchTypeChange={(value) => this.handleSearchTypeChange(value)}
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
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
});
