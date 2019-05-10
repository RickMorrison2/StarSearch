import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

let heroku = 'https://rick-mvp-project.herokuapp.com'

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
      prevSearchesOpen: false
    }
  }

  handleSearch() {
    this.searchDatabaseByName1(this.state.text1)
    this.searchDatabaseByName2(this.state.text2)
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
    fetch(`${heroku}/searches`, options)
    .then(Alert.alert('', 'Search saved!'))
  }

  getSearches() {
    fetch(`${heroku}/searches`)
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
      <Text>Select your search type:</Text>
        <RadioForm
          radio_props={[
            {label: 'Movies/TV Shows', value: 1},
            {label: 'Actors', value: 2}
          ]}
          initial={1}
          onPress={(value) => this.props.handleSearchTypeChange(value)}
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
          placeholder="Movie/Show 1"
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
          placeholder="Movie/Show 2"
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
  );
} else if (this.state.resultsOpen === true && this.state.prevSearchesOpen === false) {
  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/Starsinthesky.jpg')} />
    <View style={{
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 10
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
      }}>{`${this.state.text1} and ${this.state.text2} have both been in: `}  
            <Text style={{
              fontSize: 18,
              color: 'white',
              padding: 5,
              // flex: 1,
              display: 'flex',
              // flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>{`
            Movies: ${this.state.sharedMovies}
            TV Shows: ${this.state.sharedShows}
            `}
            </Text>
      </Text>
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
  image: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  }
});