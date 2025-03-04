import { withLayoutContext } from "expo-router";
import { useEffect, useState } from "react";
import { PixelRatio, StyleSheet } from "react-native";
import { useColorScheme } from 'react-native';

export const head = '#433878';
const colorScheme = useColorScheme();
const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
useEffect(() => {
  setIsDarkMode(colorScheme === 'dark');
}, [colorScheme]); 

export const globalStyles = StyleSheet.create (
{
    container: {
        flex: 1,
        backgroundColor: colorContainer(),
        alignItems: 'center',
        justifyContent: 'center',
      },
    inputTxt : {
       backgroundColor: colorBase(),
       color: colorText(),
       justifyContent: 'center',
       padding: 5,
       minHeight:20,
       borderRadius: 7
    },
    text: {
        color: colorText(),
    },
    link: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: colorText()
      },
    container_H :{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        textAlign: 'center',
        position:'relative'
    },
    text_container_H : {
        color: colorText(),
        marginTop:10,
        justifyContent: 'center',
        display: 'flex',
        fontWeight: 'bold'
    },
    inlineBlock: {
        display: 'flex',
        margin: 5, 
      },
      negrita: {
        fontWeight: 'bold'
      },
      forms : {
        textAlign: 'justify',
        width: '100%',
        maxWidth: PixelRatio.getPixelSizeForLayoutSize(400),
        height: 'auto',
        shadowColor: boxShadow(),
        borderRadius: 10,
        padding: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      alignNormal : {
        textAlign: 'justify',
      },
      btn_normal: {
        backgroundColor: '#9B7EBD',
        borderRadius:10,
        padding: 10,
      },
      btn_div2: {
        minHeight:70,
        width: '47%',
        textAlign:'center',
        justifyContent: 'center'
      },
      unCheck:{
        backgroundColor: 'rgba(155, 126, 189, 0.2)',
        position:'relative',
        
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
      },
      check: {
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
        height: '100%',
        position: 'absolute',
        left: '2.5%'
      },
      center: {
        textAlign:'center',
        justifyContent: 'center'
      },
      header: {
        position:'absolute',
        top:0,
        minHeight:90,
      },
});

 // ----------- colores constantes -----------------
export function colorContainer(){
    if (isDarkMode) {
        return '#25292e';
      } else {
        return '#CDC1FF';
      }
}
export function colorBase() {
    if (isDarkMode) {
        return '#000';
      } else {
        return '#fff';
      }
}
export function colorText() {
    if (isDarkMode) {
        return '#fff';
      } else {
        return '#000';
      }
}
export function boxShadow() {
    if (isDarkMode) {
        return '#7E60BF';
      } else {
        return '#000';
      }
}