import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [name,setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createUserHandler = () => {
    if(email == '') return alertMessage('Please enter Email')
    if(password == '') return alertMessage('Please enter Password')
    if(name == '') return alertMessage('Please enter Name')
    if(username == '') return alertMessage('Please enter username')

    try {
      console.log(email,'this is the email');
      auth().createUserWithEmailAndPassword(email, password).then(user=> firestore().collection('Users').doc(user.user.uid).set({
        fullname: name,
        username: username,
        bio: '',
        email: email,
        phoneNumber: '',
        gender: ''
      })).catch(error => alertMessage('Email is already exist or invalid email'))
    } catch (error) {
      alertMessage('Something went wrong')
    }
    
  };

  const alertMessage = (body)=>{
    Alert.alert(
      'Error!',
      body,
      [
        {text: 'OK', onPress: ()=> console.log('OK')}
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require('../assets/image/Logo.png')}/>
      </View>
      <TextInput style={styles.form} placeholder={'Name'} onChangeText={text=> setName(text)}/>
      <TextInput style={styles.form} placeholder={'Username'} onChangeText={text=> setUsername(text)}/>
      <TextInput style={styles.form} placeholder={'Email'} onChangeText={text => setEmail(text)} />
      <TextInput
        style={styles.form}
        placeholder={'Password'}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={createUserHandler}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <View style={styles.textChild}>
          <Text>Forgot Password?</Text>
        </View>
        <View>
          <Text onPress={()=>navigation.pop()}>Already have an account? Sign In</Text>
        </View>
      </View>
    </View>
  );
};

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
    padding:30,
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
    flex: 0.7
  },
  image:{
    height: 175,
    width: 350
  }
});

export default SignUp;
