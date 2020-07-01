import React,{useState,useEffect} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableWithoutFeedback} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {GoogleSignin} from '@react-native-community/google-signin'

const Profile = ({route,navigation})=>{
    const [user,setUser] = useState({})
    const [loading,setLoading] = useState(true)
    const [posts,setPosts] = useState([])
    let userID=''
    if(route?.params?.uid){
        userID=route.params.uid
        console.log('use route')
    }else{
        userID = auth().currentUser.uid
        console.log('use auth')
    }

    useEffect(() => {
        getUser()
        getPost()
    }, [])

    const getUser = async () =>{
        try {
            const response = await firestore().collection('Users').doc(userID).get()
            setUser(response._data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPost = async ()=>{
        try {
            let _data = []
            const response = await firestore().collection('Posts').where('uid','==',userID).orderBy('createdAt', 'desc').get().then(snapshot=>{
                snapshot.forEach(doc=>{
                    const {caption,createdAt,image,uid, avatar, username} = doc.data()
                    _data.push({
                        key: doc.id,
                        caption,
                        createdAt,
                        image,
                        avatar,
                        username,
                        uid
                    })
                })
            })
            setPosts(_data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const splitEvery = (array, length) =>
        array.reduce(
            (result, item, index) => {
            if ( index % length === 0 ) result.push([])
            result[Math.floor(index / length)].push(item)
            return result
            },
            []
    )

    return(
        <ScrollView>
        <View>
            <View style={styles.profileHeader}>
                <View style={styles.profileHead}>
                    <View>
                        {user?.avatar ? <Image style={styles.image} source={{uri: user.avatar}}/> : <Image style={styles.image} source={{uri: 'https://www.hotelieracademy.org/wp-content/uploads/2019/04/user-icon-human-person-sign-vector-10206693.png'}}/>}
                    </View>
                </View>
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <Text style={styles.fullName}>{user?.fullname}</Text>
                </View>
                <Text style={styles.bio}>Biography</Text>
                <Text style={styles.textBio}>{user?.bio}</Text>
            </View>
            <View style={styles.editContainer}>
                <TouchableOpacity style={styles.editButton} onPress={()=> navigation.navigate('EditProfile',{data:user})}><Text>Edit Profile</Text></TouchableOpacity>
            </View>
            <View>
                {loading? (
                    <ActivityIndicator />
                ): (
                    splitEvery(posts,3).map(postsChunk=>{
                        return(
                            <View style={styles.postRow}>
                                {postsChunk.map(post=>{
                                    return(
                                        <TouchableWithoutFeedback activeOpacity={0.1} onPress={()=>navigation.navigate('PostDetails',{data:post})}>
                                        <Image style={styles.imagePost} source={{uri: post.image}} />
                                        </TouchableWithoutFeedback>
                                    )
                                })}
                            </View>
                        )
                    })
                )}
            </View>
            <View>
                <TouchableOpacity onPress={()=> {
                    auth().signOut()
                    GoogleSignin.signOut()
                }}><Text>SignOut</Text></TouchableOpacity> 
            </View>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        height: 100,
        width: 100,
        borderRadius: 100/2
    },
    profileHeader:{
        padding: 20,
    },
    profileHead: {
        marginBottom: 10,
        alignItems: "center"
    },
    follow: {
        flex: 0.3,
        marginLeft: 30
    },
    editButton:{
        width: 300,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#e8e8e8'
    },
    editContainer:{
        alignItems: 'center'
    },
    imagePost:{
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: '#000000'
    },
    postRow:{
        flexDirection: 'row'
    },
    fullName:{
        fontWeight: 'bold',
        fontSize: 18
    },
    bio:{
        fontWeight: 'bold'
    },
    textBio:{
        marginBottom: 5
    }
})

export default Profile