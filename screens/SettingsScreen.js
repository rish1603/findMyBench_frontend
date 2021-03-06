import React from 'react';
import { ActivityIndicator, Button, Clipboard, Image, Share,
    StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform
} from 'react-native';
import Exponent, { Constants, ImagePicker, registerRootComponent, Permissions, Location } from 'expo';
import * as text_en from '../constants/text_en';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'app.json',
    };

    state = {
        image: null,
        uploading: false,
        location: null,
        errorMessage: null,
    };

    render() {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        // return (
        //     <Text>SEX PLS</Text>
        // );
        let { image } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        marginHorizontal: 15,
                    }}>
                </Text>

                <Button onPress={this._takePhoto} title="Capture Bench" />
                <Button onPress={this.getLocationAsync} title="Log GPS" />

                {this._maybeRenderImage()}
                {this._maybeRenderUploadingOverlay()}
                <StatusBar barStyle="default" />
            </View>
        );

    }
    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 30,
                    width: 250,
                    borderRadius: 3,
                    elevation: 2,
                    shadowColor: 'rgba(0,0,0,1)',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 4, height: 4 },
                    shadowRadius: 5,
                }}>
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        overflow: 'hidden',
                    }}>
                    <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                </View>

                <Text
                    onPress={this._copyToClipboard}
                    onLongPress={this._share}
                    style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                    {image}
                </Text>
            </View>
        );
    };

    _share = () => {
        Share.share({
            message: this.state.image,
            title: 'Check out this photo',
            url: this.state.image,
        });
    };

    _copyToClipboard = () => {
        Clipboard.setString(this.state.image);
        alert('Copied image URL to clipboard');
    };

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };
    // _getLocationAsync = async () => {
    //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //     if (status !== 'granted') {
    //         this.setState({
    //             errorMessage: 'Permission to access location was denied',
    //         });
    //         let text = JSON.stringify(this.state.location);
    //         console.log(text);
    //     }
    //
    //     let location = await Location.getCurrentPositionAsync({});
    //     this.setState({ location });
    // };
    getLocationAsync = async () =>{
        const { Location, Permissions } = Expo;
        const { status } = await Permissions.getAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let location = await  Location.getCurrentPositionAsync({enableHighAccuracy: true});
            console.log(JSON.stringify(location));
            return location;
        } else {
            throw new Error('Location permission not granted');
        }
    };


    _handleImagePicked = async pickerResult => {
        let uploadResponse, uploadResult, uploadLocation;

        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                uploadResponse = await uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse.json();
                this.setState({ image: uploadResult.location });
            }
        } catch (e) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ e });
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };
}
async function uploadImageAsync(uri) {
    // let apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';
    console.log("from upload image async");

      apiUrl = `http://165.227.239.135:8080`;

    let uriParts = uri.split('.');
    let fileType = uri[uri.length - 1];
    let formData = new FormData();

    formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    });

    let options = {
        method: 'POST',
        body: formData,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    };

    return fetch(apiUrl, options);
}
