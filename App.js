import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk';
import Reducers from './src/2.reducers'
import firebase from 'firebase'
import TodoListScreen from './src/components/TodoListScreen';
import TodoStack from './src/navigators/TodoStack';


export default function App() {
  const store = createStore(Reducers, {}, applyMiddleware(ReduxThunk))
  const [load, setLoad] = useState(false)

  useEffect( () => {
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    })
    .then(() => setLoad(true))
    
  })

  // Replace config ini dengan config kalian sendiri ya gengs
  const firebaseConfig = {
    apiKey: "AIzaSyAss6G6sK2sGM89TRVtxXHYfUGzy0f8p44",
    authDomain: "todo-exam.firebaseapp.com",
    databaseURL: "https://todo-exam.firebaseio.com",
    projectId: "todo-exam",
    storageBucket: "todo-exam.appspot.com",
    messagingSenderId: "712447727595",
    appId: "1:712447727595:web:352b5934e8c35c786cabae"
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  console.disableYellowBox = true
  if(load){
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <TodoStack />
        </View>
      </Provider>
    );
  }else{
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
