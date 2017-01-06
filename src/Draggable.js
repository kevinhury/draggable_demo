// @flow

import React, { Component } from 'react'
import { PanResponder, Animated, View, Dimensions } from 'react-native'

export type Point = { x: number, y: number }

export class Draggable extends Component {
	_panResponder: PanResponder
	state: any

	constructor(props) {
		super(props)
		this.state = {
			pan: new Animated.ValueXY()
		}
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value })
				this.state.pan.setValue({ x: 0, y: 0 })
			},
			onPanResponderMove: Animated.event([null, {
				dx: this.state.pan.x,
				dy: this.state.pan.y,
			}]),
			onPanResponderRelease: () => {
				this.state.pan.flattenOffset()
				this.moveToClosestAnchor()
			}
		})
	}

	moveToClosestAnchor() {
		if (this.props.anchors.length == 0) return
		const x = this.state.pan.x._value
		const y = this.state.pan.y._value
		const dis = this.props.anchors.map(anchor => this.distance(anchor, { x, y }))
		var toValue = this.props.anchors[dis.indexOf(Math.min(...dis))]
		Animated.spring(
			this.state.pan,
			{ toValue }
		).start()
	}

	distance(p1: Point, p2: Point) {
		return Math.sqrt((p2.x -= p1.x) * p2.x + (p2.y -= p1.y) * p2.y)
	}

	render() {
		return (
			<View style={{ flex: 1, alignSelf: 'stretch' }} onLayout={() => this.moveToClosestAnchor()}>
				<Animated.View
					{ ...this._panResponder.panHandlers}
					style={{
						transform: [{ translateX: this.state.pan.x }, { translateY: this.state.pan.y }],
					}}>
					{this.props.children}
				</Animated.View>
			</View>
		)
	}
}