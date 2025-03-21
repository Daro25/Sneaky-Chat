import { Text, View, TextInput, SafeAreaView, Button, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { colorContainer, useGlobalStyles, useTheme } from "./recursos/style";
import { useEffect, useState } from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Animated, {
  useSharedValue,
  FadeIn,
  Easing,
} from 'react-native-reanimated';

export default function Registro_sala() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [Rpass, setRpass] = useState("");
  const [Id, setId] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(true);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const registro = async ()=>{
    await drizzleDb.insert(schema.salas).values({
        idSala: Id,
        nombre: name,
        pass: pass
      })
  };
  const login = async ()=>{
    await drizzleDb.insert(schema.salas).values({
      idSala: Id,
      nombre: name,
      pass: pass
    })
  };
  const screenWidth = Dimensions.get('window').width;
  const leftAnim = useSharedValue(screenWidth*0.025);

  const handlePress = (bool: Boolean) => {
    if (bool) {
      leftAnim.value = screenWidth*(0.5);
      setVisible1(true)
      setVisible2(false)
    } else {
      leftAnim.value = screenWidth*(0.025);
      setVisible1(false)
      setVisible2(true)
    }
  };
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const isDarkMode = useTheme();
  return (
    <Animated.View
      entering={FadeIn}>
    <SafeAreaView style={[useGlobalStyles().container, [,{backgroundColor:colorContainer(isDarkMode)+'40'}]]}>
      <View style={[useGlobalStyles().container_H, useGlobalStyles().center, useGlobalStyles().header]}>
        <Animated.View style={[
          useGlobalStyles().btn_div2, 
          useGlobalStyles().btn_normal, 
          [useGlobalStyles().check,{left: leftAnim}]]}/>
            <TouchableOpacity
              onPress={()=>handlePress(false)}
              style={[useGlobalStyles().inlineBlock, useGlobalStyles().btn_div2, useGlobalStyles().unCheck]}>
              <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Unirse a una sala.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>handlePress(true)}
              style={[useGlobalStyles().inlineBlock, useGlobalStyles().btn_div2, useGlobalStyles().unCheck]}>
              <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Crear una sala.</Text>
            </TouchableOpacity>
      </View>

      <View style={useGlobalStyles().forms}>
        {visible2 && (
          <Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>
          Pidele al administrador de la sala que te pase nombre y contraseña o crea la tuya e invita a alguien presionando en el botón superior de Crear una sala.
          </Text>
        )}
        <View style={useGlobalStyles().container_H}>
          <Text style={useGlobalStyles().text_container_H}>Nombre de la Sala: </Text>
          <TextInput 
          style={[useGlobalStyles().inputTxt, useGlobalStyles().inlineBlock]} 
          value={name} 
          onChangeText={setName}
          placeholder="Sala12334"
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

        {visible1 && 
        (<><Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>Repita contraseña:</Text><TextInput
          style={useGlobalStyles().inputTxt}
          value={Rpass}
          onChangeText={setRpass}
          secureTextEntry={true}
          placeholderTextColor={'#a9a9a9'}
          placeholder="Password25"
          maxLength={20} /><TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().center, useGlobalStyles().inlineBlock, [, { width: '100%', minHeight: 70 }]]}
            onPress={registro}>
            <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Crear sala</Text>
          </TouchableOpacity></>)}
          {visible2 && (
            <TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().center, useGlobalStyles().inlineBlock, [,{width:'100%', minHeight:70}]]}
            onPress={login}>
            <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Unirse</Text>
          </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
    </Animated.View>
  );}