/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import RefreshFlatList from './RefreshFlatList';

async function waitForDisplayed(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(void 0), ms);
  });
}

const App = () => {
  const [list, setList] = useState(randomColors());

  const onRefresh = async () => {
    await waitForDisplayed(2000);
    setList(randomColors());
  };

  const onEndReached = async () => {
    if (list.length > 50) {
      return;
    }
    await waitForDisplayed(2000);
    setList(_list => {
      return _list.concat(randomColors());
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <RefreshFlatList
        data={list}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const renderItem = ({item, index}: {item: string; index: number}) => {
  return (
    <View style={[styles.item, {backgroundColor: item}]}>
      <Text style={styles.index}>{index}</Text>
      <Text style={styles.text}>_{item}</Text>
    </View>
  );
};

export default App;

const randomColors = (size = 10) => {
  const colors = [];
  for (let i = 0; i < size; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push('#' + r.toString(16) + g.toString(16) + b.toString(16));
  }
  return colors;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    marginHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    borderRadius: 12,
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  index: {
    fontSize: 24,
    color: '#000',
  },
  control: {
    height: 100,
    marginTop: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  control_text: {
    fontSize: 18,
    color: 'red',
  },
});
