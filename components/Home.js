import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Home = ({navigation}) => {
  const [feed, setFeed] = useState([]);
  const [loading,setLoading] = useState(true)
  const [likedPost,setLikedPost] = useState([])

  useEffect(() => {
    getFeed();
    getLikes();
  }, [liked]);

  const likeToast = ()=>{
    ToastAndroid.show('Liked!',ToastAndroid.SHORT)
  }

  const unlikeToast = ()=>{
    ToastAndroid.show('Unliked',ToastAndroid.SHORT)
  }

  const getFeed = async () => {
    try {
        let feeds = []
      await firestore()
        .collection('Posts')
        .orderBy('createdAt','desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              const {caption,createdAt,image,uid, avatar, username} = doc.data()
              feeds.push({
                  key: doc.id,
                  caption,
                  createdAt,
                  image,
                  avatar,
                  username,
                  uid
              })
          });
        })
        .then(()=>setLoading(false));
        setFeed(feeds)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const getLikes = ()=>{
    console.log('masuk')
    try {
      let _likes = []
      firestore().collection(`Users/${auth().currentUser.uid}/LikedItems`).get().then(snapshot=>{
        snapshot.forEach(doc =>{
          console.log(doc.id)
          _likes.push(
            doc.id
          )
        })
        console.log(_likes,'list')
        setLikedPost(_likes)
      })
      .catch(error=>console.log(error))
      console.log(test,'test')
    } catch (error) {
      
    }
  }

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

  const pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('You cancel choose image');
      } else if (response.error) {
        console.log('An error happens');
      } else {
        const source = {uri: response.uri};
        navigation.navigate('CreatePost', {
          img: source,
        });
      }
    });
  };

  const liked = async (array,key)=>{
    try {
      if(array.includes(key)){
        await firestore().collection(`Users/${auth().currentUser.uid}/LikedItems`).doc(key).delete().then(()=>unlikeToast())
        getLikes()
      }
      else{
        await firestore().collection(`Users/${auth().currentUser.uid}/LikedItems`).doc(key).set({
        liked: true
        }).then(()=>likeToast())
        getLikes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={{flex: 1}}>
    <ScrollView style={styles.container}>
      {loading ? (<ActivityIndicator size="small" color="#0000ff" />) : (
        feed.map(data => {
        return (
          <View style={styles.card} key={data.key}>
              <TouchableWithoutFeedback onPress={()=>navigation.navigate('Profile',{uid: data.uid})}>
                <View style={styles.profileView}>
                  <Image
                  style={styles.avatar}
                  source={{
                    uri:
                      data.avatar,
                  }}
                />
                <View style={styles.username}>
                  <Text style={styles.userName}>{data.username}</Text>
                </View>
                </View>
              </TouchableWithoutFeedback>
            <Image style={styles.contentImage} source={{uri: data.image}} />
            <View style={styles.footer}>
              <View style={styles.iconRow}>
                { likedPost.includes(data.key) ? <Icon name="heart" onPress={()=>liked(likedPost,data.key)} size={30} color="#900"/> : <Icon name="heart-outline" onPress={()=>liked(likedPost,data.key)} size={30}/>}
                <Icon style={{marginLeft:10}} name="message-outline" size={30} onPress={()=> navigation.navigate('Comment',{caption: data.caption, data:data, key: data.key})}/>
              </View>
              <Text>{data.caption}</Text>
            </View>
          </View>
        );
      })
      )}
    </ScrollView>
      <View>
        <TouchableOpacity onPress={()=>pickImage()} style={styles.floating}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ededed',
  },
  card: {
    elevation: 1,
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 15,
    borderRadius: 20/2
  },
  profileView: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 5
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
  },
  contentImage: {
    height: 300,
    marginHorizontal: 10,
    backgroundColor: '#dec1c1',
    marginBottom: 5
  },
  username: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  footer:{
    marginLeft: 10
  },
  userName:{
    fontWeight: 'bold'
  },
  iconRow:{
    flexDirection: 'row'
  },
  floating:{
    height: 60,
    width: 60,
    borderRadius: 200,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#d6d6d6',

  }
});

export default Home;
