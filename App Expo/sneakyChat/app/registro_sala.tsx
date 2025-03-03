import { Text, View, StyleSheet, TextInput, SafeAreaView, Button, Touchable, TouchableOpacity, Dimensions } from "react-native";
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

  const screenWidth = Dimensions.get('window').width;
  const leftAnim = useSharedValue(screenWidth*0.025);

  const handlePress = (bool: Boolean) => {
    if (bool) {
      let a = screenWidth*(0.5);
      withTiming(a, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
    } else {
      let a = screenWidth*(0.025);
      withTiming(a, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
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

        <Text style={[globalStyles.text, globalStyles.negrita]}>Repita contraseña:</Text>
        <TextInput 
        style={globalStyles.inputTxt} 
        value={Rpass} 
        onChangeText={setRpass}
        secureTextEntry={true}
        placeholderTextColor={'#a9a9a9'}
        placeholder="Password25"
        maxLength={20}/>
      </View>
    </SafeAreaView>
  );
}
  function login() {}
  function registro() {}