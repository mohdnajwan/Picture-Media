import React,{useState,useEffect} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native'
import firestore from '@react-native-firebase/firestore'

const ProfileDetails = ({route,navigation}) =>{
    const {data} = route.params
    const [user,setUser] = useState({})
    const [loading,setLoading] = useState(true)
    const [posts,setPosts] = useState([])

    useEffect(() => {
        getUser()
        getPost()
    }, [])

    const getUser = async () =>{
        try {
            const response = await firestore().collection('Users').doc(data.uid).get()
            setUser(response._data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPost = async ()=>{
        try {
            let _data = []
            const response = await firestore().collection('Posts').where('uid','==',data.uid).orderBy('createdAt', 'desc').get().then(snapshot=>{
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
        <View>
            <View style={styles.profileHeader}>
                <View style={styles.profileHead}>
                    <View style={{flex: 0.3}}>
                        {user.avatar ? <Image style={styles.image} source={{uri: user.avatar}}/> : <Image style={styles.image} source={{uri: 'https://www.hotelieracademy.org/wp-content/uploads/2019/04/user-icon-human-person-sign-vector-10206693.png'}}/>}
                    </View>
                    <Text style={styles.follow}>Followers</Text>
                    <Text style={styles.follow}>Following</Text>
                </View>
                <Text>{user.fullname}</Text>
                <Text>Bio</Text>
                <Text>{user.bio}</Text>
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
                                        <TouchableOpacity activeOpacity={0.1} onPress={()=>navigation.navigate('PostDetails',{data:post})}>
                                        <Image style={styles.imagePost} source={{uri: post.image}} />
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )
                    })
                )}
            </View>
            <View>
                <TouchableOpacity onPress={()=> auth().signOut()}><Text>SignOut</Text></TouchableOpacity> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        height: 70,
        width: 70,
        borderRadius: 70/2
    },
    profileHeader:{
        height: 200,
        padding: 20
    },
    profileHead: {
        flexDirection: 'row',
        marginBottom: 10
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
    }
})

export default ProfileDetails