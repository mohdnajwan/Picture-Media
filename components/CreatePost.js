import React, {useState} from 'react'
import {StackActions} from '@react-navigation/native'
import {View,Text,Image, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, Alert, ScrollView} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import auth, { firebase } from '@react-native-firebase/auth'
import '@react-native-firebase/app'

const CreatePost = ({route, navigation}) =>{
    const { img } = route.params;
    const [caption, setCaption] = useState('');
    const { uri } = img;

    console.log(uri,'url image')

    const post = async ()=>{
        try {
            let _user = [];
            if(uri){
                const filename = uri.substring(uri.lastIndexOf('/') + 1);
                const task = storage().ref(`post/${filename}`).putFile(uri)

                task.on('state_changed',snapshot =>{}, err=>{console.log(err)}, async () =>{
                    const url = await task.snapshot.ref.getDownloadURL();

                    await firestore().collection('Users').doc(auth().currentUser.uid).get().then(snapshots=>{
                        _user.push(snapshots._data)
                    })
                    console.log(_user)
                    await firestore().collection('Posts').add({
                        image: url,
                        caption: caption,
                        uid: auth().currentUser.uid,
                        username: _user[0].username,
                        avatar: _user[0].avatar,
                        createdAt: firestore.FieldValue.serverTimestamp()
                    })
                    .then(()=> ToastAndroid.show('Successfully Upload', ToastAndroid.SHORT))
                    .then(()=> navigation.dispatch(StackActions.popToTop()))
                    .catch(error=> Alert.alert('Error','Something Went Wrong!',[{text: 'OK', onPress: ()=>console.log('OK')}]))
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <ScrollView>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={img} />  
            </View>
            <Text style={styles.caption}>Caption</Text>
            <TextInput style={styles.form} placeholder={'Caption..'} multiline={true} numberOfLines={3} onChangeText={text =>setCaption(text)} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={post}><Text>Post</Text></TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center'
    },
    image: {
        height: 400,
        width: 400,
        borderRadius: 20/2
    },
    caption:{
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10
    },
    button:{
        width: 200,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#179dfc',
        borderRadius: 20/2
    },
    buttonContainer:{
        alignItems: 'center'
    },
    form:{
        marginLeft: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20/2,
        marginBottom: 30
    }
})

export default CreatePost