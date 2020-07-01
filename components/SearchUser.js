import React,{useState} from 'react'
import {View,Text,TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator, TouchableWithoutFeedback} from 'react-native'
import firestore from '@react-native-firebase/firestore'

const SearchUser = ({navigation})=>{
    const [searchText,setSearchText] = useState('')
    const [loading,setLoading] = useState(false)
    const [users,setUsers] = useState([]);
    const [searched,setSearched] = useState(false)

    const searchUser = async ()=>{
        setLoading(true)
        setSearched(true)
        try {
            let _user = []
            await firestore().collection('Users').where('username','==',searchText).get().then(snapshot=>{
                snapshot.forEach(doc=>{
                    _user.push({
                        uid: doc.id,
                        username: doc.data().username,
                        avatar: doc.data().avatar,
                        fullname: doc.data().fullname
                    })
                })
            }).then(()=>{
                setUsers(_user)
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    console.log(users)

    return(
        <View style={styles.container}>
            <View style={styles.headerSearch}>
                <TextInput style={styles.textInput} onChangeText={text=>setSearchText(text)} placeholder={'Search User..'} />
                <TouchableOpacity onPress={searchUser} style={styles.searchButton}><Text>Search</Text></TouchableOpacity>
            </View>
            {searched ? (loading ? <ActivityIndicator size="small" color="#0000ff" /> : users.map(user=>{
                return(
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate('Profile',{uid: user.uid})}>
                    <View style={styles.header}>
                            <Image style={styles.avatar} source={{uri: user.avatar}} />
                            <View style={styles.nameText}>
                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={styles.fullname}>{user.fullname}</Text>
                            </View>
                    </View>
                    </TouchableWithoutFeedback>
                )
            })) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    },
    headerSearch: {
        flexDirection: "row"
    },
    textInput: {
        padding: 10,
        flex: 1,
    },
    searchButton:{
        padding: 10,
        backgroundColor: '#52a6bf',
        justifyContent: "center",
        borderRadius: 30/2
    },
    avatar:{
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    header:{
        flexDirection: 'row',
        height: 60,
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    nameText: {
        marginLeft: 20
    },
    username: {
        fontWeight: 'bold'
    },
    fullname:{
        fontWeight: '200'
    }
})

export default SearchUser