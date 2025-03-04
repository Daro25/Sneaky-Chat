import { Text, View, TextInput, SafeAreaView, Button, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { globalStyles } from "./recursos/style";
import { useState } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  SlideInLeft,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated';

export default function Registro_sala() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [Rpass, setRpass] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(true);

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

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={[globalStyles.container_H, globalStyles.center, globalStyles.header]}>
        <Animated.View style={[
          globalStyles.btn_div2, 
          globalStyles.btn_normal, 
          [globalStyles.check,{left: leftAnim}]]}/>
            <TouchableOpacity
              onPress={()=>handlePress(false)}
              style={[globalStyles.inlineBlock, globalStyles.btn_div2, globalStyles.unCheck]}>
              <Text style={[globalStyles.text, globalStyles.negrita, globalStyles.center]}>Unirse a una sala.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>handlePress(true)}
              style={[globalStyles.inlineBlock, globalStyles.btn_div2, globalStyles.unCheck]}>
              <Text style={[globalStyles.text, globalStyles.negrita, globalStyles.center]}>Crear una sala.</Text>
            </TouchableOpacity>
      </View>

      <View style={globalStyles.forms}>
        {visible2 && (
          <Text style={[globalStyles.text, globalStyles.negrita]}>
          Pidele al administrador de la sala que te pase nombre y contraseña o crea la tuya e invita a alguien presionando en el botón superior de Crear una sala.
          </Text>
        )}
        <View style={globalStyles.container_H}>
          <Text style={globalStyles.text_container_H}>Nombre de la Sala: </Text>
          <TextInput 
          style={[globalStyles.inputTxt, globalStyles.inlineBlock]} 
          value={name} 
          onChangeText={setName}
          placeholder="Sala12334"
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

        {visible1 && 
        (<><Text style={[globalStyles.text, globalStyles.negrita]}>Repita contraseña:</Text><TextInput
          style={globalStyles.inputTxt}
          value={Rpass}
          onChangeText={setRpass}
          secureTextEntry={true}
          placeholderTextColor={'#a9a9a9'}
          placeholder="Password25"
          maxLength={20} /><TouchableOpacity style={[globalStyles.btn_normal, globalStyles.center, globalStyles.inlineBlock, [, { width: '100%', minHeight: 70 }]]}
            onPress={registro}>
            <Text style={[globalStyles.text, globalStyles.negrita, globalStyles.center]}>Crear sala</Text>
          </TouchableOpacity></>)}
          {visible2 && (
            <TouchableOpacity style={[globalStyles.btn_normal, globalStyles.center, globalStyles.inlineBlock, [,{width:'100%', minHeight:70}]]}
            onPress={login}>
            <Text style={[globalStyles.text, globalStyles.negrita, globalStyles.center]}>Unirse</Text>
          </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
  );
}
  function login() {}
  function registro() {}