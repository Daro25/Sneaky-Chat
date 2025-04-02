import { Text, View, TextInput, SafeAreaView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useGlobalStyles, useTheme } from "./recursos/style";
import { useState } from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from "expo-router";
import * as schema from '@/db/schema';
import { RSA } from 'react-native-rsa-native';
import { GuardarLlavePrivada } from "./recursos/secureStore";
import Animated, { useSharedValue, Easing } from 'react-native-reanimated';
import { replace } from "expo-router/build/global-state/routing";

export default function Registro_sala() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [Rpass, setRpass] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const screenWidth = Dimensions.get('window').width;
  const leftAnim = useSharedValue(screenWidth * 0.025);
  leftAnim.value = screenWidth * 0.5;
  const [errors, setErrors] = useState('')
  const handlePress = (bool: boolean) => {
    if (!bool) {
        router.replace('/registro_sala');
    } else {
        
    }
  };

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const registro = async () => {
    if (!name || !pass || !Rpass) {
      Alert.alert("Llena los campos", 'No dejes campos sin llenar');
      return;
    }
    if (pass !== Rpass) {
      Alert.alert("Error:", 'Las contraseñas no son idénticas.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://134.209.211.47/registro_sala.php?Contra_Sala=${pass}&Nom_Sala=${name}&Cupo=2`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data[0].resultado === 'Registro de sala exitoso.') {
        const consulta = await fetch(`http://134.209.211.47/Consulta_Sala.php?nombre=${encodeURIComponent(name)}&pass=${encodeURIComponent(pass)}`);
        if (!consulta.ok) throw new Error(`HTTP error! status: ${consulta.status}`);
        const dataConsult = await consulta.json();
        const salaId = dataConsult[0].ID_Sala;

        const userResult = await drizzleDb.select().from(schema.datosp);
        if (userResult.length > 0) {
          const { idUser, pass: userPass, year } = userResult[userResult.length - 1];
          const keys = await RSA.generateKeys(512);
          await GuardarLlavePrivada(keys.private);
          const responseU = await fetch(`http://134.209.211.47/registro_usuario.php?nomb=${encodeURIComponent(idUser)}&contra=${encodeURIComponent(userPass)}&sala_id=${salaId}&edad=${year}&key=${encodeURIComponent(keys.public)}`);
          if (!responseU.ok) throw new Error(`HTTP error! status: ${responseU.status}`);
        }

        await drizzleDb.insert(schema.salas).values({ idSala: salaId, nombre: name, pass: pass });
        router.replace('/');
      } else {
        Alert.alert("Error:", data[0].resultado);
      }
    } catch (error) {
      Alert.alert("Error:", error+'' || String(error));
    } finally {
      setIsLoading(false);
    }
  };

    const login = async () => {
    if (!name || !pass) {
      Alert.alert("Llena los campos", 'No dejes campos sin llenar');
      return;
    }
    setIsLoading(true);
    try {
      const consulta = await fetch(`http://134.209.211.47/Consulta_Sala.php?nombre=${encodeURIComponent(name)}&pass=${encodeURIComponent(pass)}`);
      if (!consulta.ok) throw new Error(`HTTP error! status: ${consulta.status}`);
      const data = await consulta.json();

      if (data.length > 0) {
        const salaId = data[0].ID_Sala;
        await drizzleDb.insert(schema.salas).values({ idSala: salaId, nombre: name, pass: pass });
        router.replace('/');
      } else {
        Alert.alert("Error:", "No se encontró la sala o la contraseña es incorrecta.");
      }
    } catch (error) {
      Alert.alert("Error:", error+'' || String(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (errors === '') {
    return (
      <SafeAreaView style={[useGlobalStyles().container]}>
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
    );
  } else {
    return(
        <Text>{errors}</Text>
      );
  }
}