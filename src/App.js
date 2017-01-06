// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue'
import { Draggable } from './Draggable'
import type { Point } from './Draggable'

// Uncomment to log 'updateViews' bridge calls.
// MessageQueue.spy(d => {
// 	if (d.method === 'updateView')
// 		console.log(d)
// })

export default class App extends Component {
  state: any

  constructor(props: any) {
    super(props)

    this.state = { anchors: [] }
  }
	
	// We're changing the anchors to handle device rotation / size changes.
  onLayoutChanged(event: any) {
    const { width, height } = event.nativeEvent.layout
    const anchors: Point[] = [
      { x: 0.0, y: 0.0 },
      { x: 0.8, y: 0.0 },
      { x: 0.0, y: 0.8 },
      { x: 0.8, y: 0.8 },
    ].map(p => {
      return { x: p.x * width, y: p.y * height }
    })

    this.setState({ anchors })
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayoutChanged.bind(this)}>
        <Draggable anchors={this.state.anchors}>
          <Image source={require('../assets/logo.png')} />
        </Draggable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
