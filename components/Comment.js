import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function Comment({navigation, route}) {
  const {data, key} = route.params;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    getComments();
  }, []);

  const addComment = async () => {
    try {
      let _user = []
      await firestore().collection('Users').doc(auth().currentUser.uid).get().then(snapshot=>{
        _user.push(snapshot._data)
      })
      
      await firestore()
        .collection('Posts')
        .doc(key)
        .collection('comments')
        .add({
          uid: auth().currentUser.uid,
          comment: comment,
          username: _user[0].username,
          avatar: _user[0].avatar,
          timestamp: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('Successfully add comment')
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      let _comment = [];
      let commentData = [];
      await firestore()
        .collection('Posts')
        .doc(key)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .get()
        .then(async querySnapshot => {
        querySnapshot.forEach(async doc => {
            const {comment, uid, timestamp, username, avatar} = doc.data();
            _comment.push({
              key: doc.id,
              uid,
              comment,
              username,
              avatar,
              timestamp
            })
          });
        })
        .catch(error => console.log('Cannot retrive document: ', error));
        setLoading(false)
        setCommentList(_comment)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{
            uri: data.avatar,
          }}
        />
        <Text style={styles.text}>{data.username}</Text>
        <Text style={styles.text}>{data.caption}</Text>
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          placeholder={'Add Comment..'}
          onChangeText={text => setComment(text)}
        />
        <TouchableOpacity style={styles.button} onPress={addComment}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
      {loading ? (<ActivityIndicator size="small" color="#0000ff" />) : (
        commentList.map(data => {
          return (
            <View style={styles.comments} key={data.key}>
              <Image
                style={styles.avatar}
                source={{
                  uri: data.avatar,
                }}
              />
              <Text style={styles.text}>{data.username}</Text>
              <Text style={styles.text}>{data.comment}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 70,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
  },
  text: {
    marginLeft: 10,
  },
  textInput: {
    marginLeft: 10,
    flex: 1,
  },
  input: {
    height: 70,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  button: {
    backgroundColor: '#7081ff',
    padding: 5,
    flex: 0.2,
    justifyContent: 'flex-end',
  },
  comments: {
    height: 70,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
});

export default Comment;
