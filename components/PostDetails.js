import React,{useState,useEffect} from 'react'
import {View,Text,Image, StyleSheet, } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'

const PostDetails = ({route,navigation}) =>{
    const {data} = route.params
    const [likedPost,setLikedPost] = useState([])

    useEffect(()=>{
        getLikes()
    },[liked])

    const likeToast = ()=>{
        ToastAndroid.show('Liked!',ToastAndroid.SHORT)
      }
    
      const unlikeToast = ()=>{
        ToastAndroid.show('Unliked',ToastAndroid.SHORT)
      }

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

    return(
        <View>
            <View style={styles.header}>
                <Image style={styles.avatar} source={{uri: data.avatar}} />
                <Text style={styles.nameText}>{data.username}</Text>
            </View>
            <Image style={styles.contentImage} source={{uri: data.image}} />
            <View style={styles.footer}>
              <View style={styles.iconRow}>
                { likedPost.includes(data.key) ? <Icon name="heart" onPress={()=>liked(likedPost,data.key)} size={30} color="#900"/> : <Icon name="heart-outline" onPress={()=>liked(likedPost,data.key)} size={30}/>}
                <Icon style={{marginLeft:10}} name="message-outline" size={30} onPress={()=> navigation.navigate('Comment',{caption: data.caption, data:data, key: data.key})}/>
              </View>
              <Text>{data.caption}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 60,
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    avatar:{
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    contentImage: {
        height: 400,
        maxHeight: 500,
        backgroundColor: '#dec1c1',
    },
    footer:{
        marginLeft: 20
    },
    nameText:{
        marginLeft: 10
    },
    iconRow:{
        flexDirection: 'row'
    },
})

export default PostDetails