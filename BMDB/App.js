import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
const console = require('console');
// const imdb = require('imdb-api');
// const console = require('console');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actorSearch: false,
      movieSearch: false
    }
  }

  handleRadioSelect() {

  }

  render() {
    if (this.state.actorSearch === false && this.state.movieSearch === false) {
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
      <Text style={{

      }}>Select your search type:</Text>
      <RadioForm
        radio_props={[
          {label: 'Movies/TV Shows', value: 0},
          {label: 'Actors', value: 1}
        ]}
        initial={0}
        onPress={(value) => {this.setState({value: value})}}
       />
    </View>
    )
  } else if (this.state.actorSearch === true && this.state.movieSearch === false) {
    return (
      <ActorSearch />
    )
  } else {
    return (
      <ActorSearch />
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
