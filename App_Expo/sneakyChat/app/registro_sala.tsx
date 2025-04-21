import { Text, View, TextInput, SafeAreaView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useGlobalStyles, useTheme } from "./recursos/style";
import { useEffect, useState } from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from "expo-router";
import * as schema from '@/db/schema';
import { RSA } from 'react-native-rsa-native';
import { GuardarLlavePrivada } from "./recursos/secureStore";
import Animated, { useSharedValue, Easing } from 'react-native-reanimated';

export default function Registro_sala() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [Rpass, setRpass] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [visible1, setVisible1] = useState(true);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const screenWidth = Dimensions.get('window').width;
  const leftAnim = useSharedValue(screenWidth * 0.025);
  const [errors, setErrors] = useState('')
  const handlePress = (bool: boolean) => {
    if (!bool) {
    } else {
        router.replace('./login_sala');
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
      const url = `https://ljusstudie.site/registro_sala.php?Contra_Sala=${encodeURIComponent(pass)}&Nom_Sala=${encodeURIComponent(name)}&Cupo=${encodeURIComponent(2)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status1: ${response.status}`);
      const data = await response.json();

      if (response.ok) {
        const url = `https://ljusstudie.site/Consulta_Sala.php?nombre=${encodeURIComponent(name)}&pass=${encodeURIComponent(pass)}`;
        const consulta = await fetch(url);
        if (!consulta.ok) throw new Error(`HTTP error! status2: ${consulta.status}`);
        const dataConsult = await consulta.json();
        const salaId = dataConsult[0].ID_Sala;

        const userResult = await drizzleDb.select().from(schema.datosp);
        const { idUser, pass: userPass, year } = userResult[userResult.length - 1];
        const urlUss = `https://ljusstudie.site/Consulta_Usuario.php?pass=${encodeURIComponent(userPass)}&nombre=${encodeURIComponent(idUser)}`;
        const consultaU = await fetch(urlUss);
        if (!consultaU.ok) { Alert.alert('Error',`HTTP error! status: ${consultaU.status}`);
        } else {
          const dataU = await consultaU.json();
          if (dataU.length === 0) {
            if (userResult.length > 0) {
              const keys = await RSA.generateKeys(512);
              await GuardarLlavePrivada(keys.private);
              const url = `https://ljusstudie.site/registro_usuario.php?nomb=${encodeURIComponent(idUser)}&contra=${encodeURIComponent(userPass)}&sala_id=${encodeURIComponent(salaId)}&edad=${year}&key=${encodeURIComponent(keys.public)}`;
              const responseU = await fetch(url);
              if (!responseU.ok) throw new Error(`HTTP error! status3: ${responseU.status}`);
            }
          }
          await drizzleDb.insert(schema.salas).values([{ idSala: salaId, nombre: name, pass: pass }]);
          router.replace('/');
        }
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
                <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Crear a una sala.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>handlePress(true)}
                style={[useGlobalStyles().inlineBlock, useGlobalStyles().btn_div2, useGlobalStyles().unCheck]}>
                <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Unirse una sala.</Text>
              </TouchableOpacity>
        </View>
  
        <View style={useGlobalStyles().forms}>
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
        </View>
      </SafeAreaView>
    );
  } else {
    return(
        <Text>{errors}</Text>
      );
  }
}