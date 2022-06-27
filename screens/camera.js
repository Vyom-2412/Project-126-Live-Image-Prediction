import * as React from 'react';
import {StyleSheet,Text,View,Button,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

export default class Camera extends React.Component
{
    state = {
        image:null
    }

    pickImage=async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled)
            {
                this.setState({
                    image:result.data
                })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(e){
            console.log(e)
        }
    }

    uploadImage=async(uri)=>{
        const data = new FormData();
        let fileName = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload={
          uri:uri,
          fileName:fileName,
          type:type
        }
        data.append("digit",fileToUpload)
        fetch("https://ff74-223-233-74-139.in.ngrok.io",{
          method:"POST",
          body:data,
          headers:{
            "content-type":"multipart/form-data"
          }
        })
        .then((response)=>response.json())
        .then((result)=>{
          console.log("Successful",result)
        })
        .catch((e)=>{
          console.log(e)
        })
    }
    getPermissions=async()=>{
        if(Platform.OS!="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                console.log("Camera Permission Denied")
            }
        }
    }
    componentDidMount(){
        this.getPermissions()
    }

    render(){
        return (
            <View style={styles.container}>
            <Button title="Pick an image" onPress = {this.pickImage}/>
            </View>
      )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});