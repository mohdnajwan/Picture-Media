import {StackActions} from '@react-navigation/native'
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const EditProfile = ({route, navigation}) => {
  const {data} = route.params;

  const [fullName, setFullName] = useState(data.fullname);
  const [bio, setBio] = useState(data.bio);
  const [email, setEmail] = useState(data.email);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);

  console.log(fullName);

  const updateProfile = async () => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({
        bio,
        email,
        fullname: fullName,
        phoneNumber,
      })
      .then(() => console.log('Set successfully!'));
  };

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.7
  };

  const pickImage = async () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) console.log('You cancel choose image');
      else if (response.error) console.log('Something is error');
      else {
        const source = {uri: response.uri};
        updloadImage(source.uri);
      }
    });
  };

  const updloadImage = async uri => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const task = storage()
      .ref(`profile/${filename}`)
      .putFile(uri);
    task.on(
      'state_changed',
      snapshot => {},
      err => console.log(err),
      async () => {
        const url = await task.snapshot.ref.getDownloadURL();
        console.log(url, 'url');
        console.log('Store Success');

        await firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .update({
            avatar: url,
          })
          .then(() => console.log('Successfuly Update Profile Picture'))
          .then(()=> navigation.dispatch(StackActions.popToTop()))
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {data.avatar ? (
          <Image style={styles.image} source={{uri: data.avatar}} />
        ) : (
          <Image
            style={styles.image}
            source={{
              uri:
                'https://www.hotelieracademy.org/wp-content/uploads/2019/04/user-icon-human-person-sign-vector-10206693.png',
            }}
          />
        )}
        <Text onPress={pickImage}>Change Profile Photo</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.textContainer}>
          <Text>Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setFullName(text)}
            value={fullName}
            placeholder={'Full Name'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text>Username</Text>
          <Text>{data.username}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Bio</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setBio(text)}
            value={bio}
            placeholder={'Bio'}
          />
        </View>
      </View>
      <View>
        <Text>Profile Information</Text>
        <View style={styles.textContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder={'Email'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text>Phone Number</Text>
          <TextInput
            keyboardType="number-pad"
            style={styles.textInput}
            onChangeText={text => setPhoneNumber(text)}
            value={phoneNumber}
            placeholder={'Phone Number'}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonUpdate} onPress={updateProfile}>
          <Text>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 10,
  },
  body: {
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7a706c',
  },
  buttonContainer: {
    alignItems: 'center'
  },
  buttonUpdate: {
      width: 200,
      backgroundColor: '#e8e8e8',
      padding: 20,
      alignItems: 'center',
      borderRadius: 200/2
  },
});

export default EditProfile;
