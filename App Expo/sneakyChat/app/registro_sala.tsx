import { Text, View, StyleSheet, TextInput, SafeAreaView, Button, Touchable, TouchableOpacity } from "react-native";
import { globalStyles } from "./recursos/style";
import { useState } from "react";
import { Link } from "expo-router";

const [name, setName] = useState("")
const [pass, setPass] = useState("")
const [Rpass, setRpass] = useState("")
const [year, setYear] = useState('');

export default function Registro_sala() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.forms}>
        <View style={globalStyles.container_H}>
          <Text style={globalStyles.text_container_H}>Nombre de usuario: </Text>
          <TextInput 
          style={[globalStyles.inputTxt, globalStyles.inlineBlock]} 
          value={name} 
          onChangeText={setName}
          placeholder="nombre_user"
          placeholderTextColor={'#a9a9a9'}
          maxLength={20}/>
        </View>

        <Text style={[globalStyles.text, globalStyles.negrita]}>Contraseña:</Text>
        <TextInput 
        style={globalStyles.inputTxt} 
        value={pass} 
        onChangeText={setPass}
        secureTextEntry={true}
        placeholder="Password25"
        placeholderTextColor={'#a9a9a9'}
        maxLength={20}/>

        <Text style={[globalStyles.text, globalStyles.negrita]}>Repita contraseña:</Text>
        <TextInput 
        style={globalStyles.inputTxt} 
        value={Rpass} 
        onChangeText={setRpass}
        secureTextEntry={true}
        placeholderTextColor={'#a9a9a9'}
        placeholder="Password25"
        maxLength={20}/>

        <View style={globalStyles.container_H}>
            <Text style={globalStyles.text_container_H}>Edad: </Text>
            <TextInput 
            style={[globalStyles.inputTxt, globalStyles.inlineBlock]} 
            value={year} 
            onChangeText={setYear}
            placeholder="20"
            placeholderTextColor={'#a9a9a9'}
            keyboardType="numeric"
            maxLength={2}/>
          </View>
          <View style={globalStyles.container_H}>
            <TouchableOpacity style={[globalStyles.btn_normal, globalStyles.inlineBlock, globalStyles.btn_div2]}
            onPress={login}>
              <Text style={[globalStyles.text, globalStyles.negrita]}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.btn_normal, globalStyles.inlineBlock, globalStyles.btn_div2]}
            onPress={registro}>
              <Text style={[globalStyles.text, globalStyles.negrita]}>Registrarse por primera vez</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );}
  //Johan tu codigo aqui abajo
  function login() {}
  function registro() {}