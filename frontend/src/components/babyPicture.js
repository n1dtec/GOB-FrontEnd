import React, {Component} from 'react'
import {View, Image} from 'react-native'
import picture from './media/picture.jpg'

export default class DisplayAnImage extends Component {
    render() {
        return (
            <View>
                <Image
                    style={{width: 50, height: 50}}
                    source={{picture}}
                />
            </View>
        );
    }
}


