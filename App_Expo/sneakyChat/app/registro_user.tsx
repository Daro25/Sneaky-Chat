import { Text, View, TextInput, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { useGlobalStyles } from "./recursos/style";
import { useState } from "react"
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { router } from "expo-router";
import { RSA } from 'react-native-rsa-native';
import * as SecureStore from 'expo-secure-store';

export default function Registro_user() {
const [name, setName] = useState("")
const [pass, setPass] = useState("")
const [Rpass, setRpass] = useState("")
const [year, setYear] = useState('')
const db = useSQLiteContext();
const drizzleDb = drizzle(db, { schema});
const login = async () => {
  if (!(name.length === pass.length && name.length === 0)) {
    if(Number(year) >= 15){
      if(Rpass === pass) {
        try {
          const url = `https://ljusstudie.site/Consulta_Usuario.php?pass=${encodeURIComponent(pass)}&nombre=${encodeURIComponent(name)}`;
          const consultaU = await fetch(url);
          if (!consultaU.ok) { Alert.alert('Error',`HTTP error! status: ${consultaU.status}`);
        } else {
            const dataU = await consultaU.json();
            if (dataU.length > 0) {
              const keys = await RSA.generateKeys(512);
              await SecureStore.setItemAsync('llavePrivada', keys.private);
              const urlUp = `https://ljusstudie.site/Consulta_Usuario.php?key=${encodeURIComponent(keys.public)}&pass=${encodeURIComponent(pass)}&nombre=${encodeURIComponent(name)}`;
              const updateU = await fetch(urlUp);
              if (!updateU.ok) {
                Alert.alert('Error',`HTTP error! status: ${updateU.status}`);
              } else {
                const dataUp = await updateU.json();
                if (Number(dataUp?.Num) > 0) {
                  await drizzleDb.insert(schema.datosp).values({
                    pass: pass,
                    idUser: name,
                    Id_Usserver: Number(dataU[0].Id_User),
                    year: Number(year)
                  });
                  Alert.alert('Confirmado', 'Tu usuario fue encontrado.',
                    [
                      {text: "OK", style: 'cancel', onPress: ()=> router.replace('./login_sala')}
                    ],
                    { cancelable: false }
                    );
                } else {
                  Alert.alert('Lo siento', 'Tu usuario no fue encontrado.');
                }
              }
            } else {
              Alert.alert('Lo siento', 'Tu usuario no fue encontrado.');
            }
          }
        } catch (error) {
          Alert.alert(
            "Error:", // Title of the alert
            error+'', // Message of the alert
            [
              {text: "OK", style: 'cancel'}
            ],
            { cancelable: true }
          );
        }
      } else {
        Alert.alert(
          "Error:", // Title of the alert
          'Las contraseñas no son identicas.', // Message of the alert
          [
            {text: "OK", style: 'cancel'}
          ],
          { cancelable: true }
        );
      }} else {
        Alert.alert(
          "Ups!", // Title of the alert
          'No permitimos a menores de 15 años.', // Message of the alert
          [
            {text: "OK", style: 'cancel'}
          ],
          { cancelable: true }
        );
      }
  } else {
    Alert.alert(
      "Llena los campos", // Title of the alert
      'No dejes campos sin llenar', // Message of the alert
      [
        {text: "OK", style: 'cancel'}
      ],
      { cancelable: true }
    );
  }
}
const registro = async ()=>{
  if (!(name.length === pass.length && name.length === 0)) {
    if(Number(year) >= 15){
      if(Rpass === pass) {
        const url = `https://ljusstudie.site/NoRepitUser.php?nombre=${encodeURIComponent(name)}`;
          const consultaU = await fetch(url);
          if (!consultaU.ok) { Alert.alert('Error',`HTTP error! status: ${consultaU.status}`);
        } else {
          const dataU = await consultaU.json();
          if (Number(dataU?.Num)===0) {
            try {
                await drizzleDb.insert(schema.datosp).values({
                  idUser: name,
                  pass: pass,
                  Id_Usserver: 0,
                  year: Number(year)
                })
                Alert.alert('Exito', 'Tu usuario será registrado en seguida, no olvides tu contraseña con la que accederas a los chats \ncontraseña: '+pass,
                  [{text: 'Ok', style: 'default', onPress: ()=>router.replace('./login_sala'),}],
                  {cancelable: false}
                );
            } catch (error) {
              Alert.alert("Error:", error+'');
            }
          } else if (Number(dataU?.Num)>0) {
            Alert.alert('Ups!', 'Este nombre de usuario ya existe, consiguete otro.');
          }
      }
      } else {
        Alert.alert(
          "Error:", // Title of the alert
          'Las contraseñas no son identicas.', // Message of the alert
          [
            {text: "OK", style: 'cancel'}
          ],
          { cancelable: true }
        );
      }} else {
        Alert.alert(
          "Ups!", // Title of the alert
          'No permitimos a menores de 15 años.', // Message of the alert
          [
            {text: "OK", style: 'cancel'}
          ],
          { cancelable: true }
        );
      }
  } else {
    Alert.alert(
      "Llena los campos", // Title of the alert
      'No dejes campos sin llenar', // Message of the alert
      [
        {text: "OK", style: 'cancel'}
      ],
      { cancelable: true }
    );
  }
  };
  
  return (
    <SafeAreaView style={[useGlobalStyles().container]}>
      <View style={useGlobalStyles().forms}>
        <View style={useGlobalStyles().container_H}>
          <Text style={[useGlobalStyles().text_container_H]}>Nombre de usuario: </Text>
          <TextInput 
          style={[useGlobalStyles().inputTxt, useGlobalStyles().inlineBlock]} 
          value={name} 
          onChangeText={setName}
          placeholder="nombre_user"
          placeholderTextColor={'#a9a9a9'}
          maxLength={20}/>
        </View>

        <Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>Contraseña:</Text>
        <TextInput 
        style={useGlobalStyles().inputTxt} 
        value={pass} 
        onChangeText={setPass}
        secureTextEntry={true}
        placeholder="Password25"
        placeholderTextColor={'#a9a9a9'}
        maxLength={20}/>

        <Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>Repita contraseña:</Text>
        <TextInput 
        style={useGlobalStyles().inputTxt} 
        value={Rpass} 
        onChangeText={setRpass}
        secureTextEntry={true}
        placeholderTextColor={'#a9a9a9'}
        placeholder="Password25"
        maxLength={20}/>

        <View style={useGlobalStyles().container_H}>
            <Text style={useGlobalStyles().text_container_H}>Edad: </Text>
            <TextInput 
            style={[useGlobalStyles().inputTxt, useGlobalStyles().inlineBlock]} 
            value={year} 
            onChangeText={setYear}
            placeholder="20"
            placeholderTextColor={'#a9a9a9'}
            keyboardType="numeric"
            maxLength={2}/>
          </View>
          <View style={useGlobalStyles().container_H}>
            <TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().inlineBlock, useGlobalStyles().btn_div2]}
            onPress={login}>
              <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().inlineBlock, useGlobalStyles().btn_div2]}
            onPress={registro}>
              <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Registrarse por primera vez</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
}