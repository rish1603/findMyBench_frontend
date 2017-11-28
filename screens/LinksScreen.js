import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';

export default class LinksScreen extends React.Component {
    static navigationOptions = {
        title: 'Capture Bench',
    };

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        flash: 'auto',
        autoFocus: 'on',
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                <Camera 
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{ flex: 1 }} type={this.state.type}>
                <View
                style={{
                    flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                }}>
                <TouchableOpacity
                style={{
                    flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                }}
                /*onPress={() => {
                    this.setState({
                        type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                }}>
                */

                //When Capture Button is pressed

                onPress={takePicture}>
                <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                {' '}Flip{' '}
                </Text>
                </TouchableOpacity>
                </View>
                </Camera>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});

takePicture = () => {
    if (this.camera) {
        this.camera.takePictureAsync()
            .then(data => console.log(data))
    }
}

