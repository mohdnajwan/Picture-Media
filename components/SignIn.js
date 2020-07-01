import 'react-native-gesture-handler'
import React, {useState} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {GoogleSignin, GoogleSigninButton} from '@react-native-community/google-signin'

GoogleSignin.configure({
  webClientId: '129996354314-i4r5tsj3juuol2o917jctbarsej35jts.apps.googleusercontent.com'
})

function SignIn({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginUserHandler = async () => {
    if(email == '') return formError('Email')

    if(password == '') return formError('Password')

    try {
      console.log(email,password)
      const response = await auth().signInWithEmailAndPassword(email, password).then(response=> console.log(response))
      .catch(error => alertError('Error','Invalid password or email'));
    } catch (error) {
      alertError('Error', 'Something went wrong')
    } 
  };

  const formError = (error)=>{
    Alert.alert(
      'Error!',
      `Please enter ${error}`,
      [
        {
          text: 'OK', onPress: ()=> console.log('Ok pressed')
        }
      ]
    )
  }

  const alertError = (title,body)=>{
    Alert.alert(
      title,
      body,
      [
        {text: 'OK', onPress: ()=> console.log('OK')}
      ]
    )
  }

  const onGoogleButtonPress = async () =>{
    try {
      setDisable(true)
      await GoogleSignin.hasPlayServices();
      const { idToken} = await GoogleSignin.signIn();
      const googleCredentials = auth.GoogleAuthProvider.credential(idToken)
      auth().signInWithCredential(googleCredentials).then(response=>response.additionalUserInfo.isNewUser ? firestore().collection('Users').doc(response.user.uid).set({
        fullname: response.user.displayName,
        avatar: response.user.photoURL,
        email: response.user.email,
        gender: '',
        phoneNumber: response.user.phoneNumber,
        username: response.user.displayName
      }) : console.log('not a new user'))
    } catch (error) {
      console.log('Opps! Something went wrong!', error)
      setDisable(false)
    }
    
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require('../assets/image/Logo.png')}/>
      </View>
      <View>
        <TextInput style={styles.form} placeholder={'Email'} onChangeText={text => setEmail(text)} />
        <TextInput style={styles.form} placeholder={'Password'} secureTextEntry={true} onChangeText={text => setPassword(text)} />
        <TouchableOpacity style={styles.button} onPress={loginUserHandler}>
          <Text>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <View style={styles.textChild}>
            <Text>Forgot Password?</Text>
          </View>
          <View>
            <Text onPress={()=>navigation.navigate('SignUp')}>New User? SignUp</Text>
          </View>
        </View>
      </View>
      <View>
        <Text>Or Login with</Text>
      </View>
      <GoogleSigninButton
      style={{ width: 192, height: 48 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={onGoogleButtonPress}
       />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form:{
    width: 350,
    backgroundColor: '#deeefa',
    padding: 20,
    marginBottom: 5
  },
  button:{
    width: 350,
    padding:20,
    backgroundColor: '#179dfc',
    marginBottom: 20,
    alignItems: 'center'
  },
  textContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  textChild:{
    flex: 0.8
  },
  image:{
    height: 175,
    width: 350
  }
});

export default SignIn;
