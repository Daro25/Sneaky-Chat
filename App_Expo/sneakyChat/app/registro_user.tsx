import { Text, View, TextInput, SafeAreaView, Button, Touchable, TouchableOpacity } from "react-native";
import { colorContainer, useGlobalStyles, useTheme } from "./recursos/style";
import { useEffect, useState } from "react"
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function Registro_user() {
const [name, setName] = useState("")
const [pass, setPass] = useState("")
const [Rpass, setRpass] = useState("")
const [year, setYear] = useState('')
const db = useSQLiteContext();
const drizzleDb = drizzle(db, { schema});
const registro = async ()=>{
  await drizzleDb.insert(schema.datosp).values({
    idUser: name,
    pass: pass
  })
};
const login = async ()=>{
  await drizzleDb.insert(schema.datosp).values({
    idUser: name,
    pass: pass
  })
};
  const isDarkMode = useTheme();
  return (
    <Animated.View
          entering={FadeIn}>
    <SafeAreaView style={[useGlobalStyles().container, [,{backgroundColor:colorContainer(isDarkMode)+'40'}]]}>
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
    </Animated.View>
  );
}