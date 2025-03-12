import { useColorScheme } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { StyleSheet, PixelRatio } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  return isDarkMode;
}
export const head = '#433878';
export function colorContainer(isDarkMode: Boolean) {
  return isDarkMode ? "#25292e" : "#CDC1FF";
}

export function colorBase(isDarkMode: Boolean) {
  return isDarkMode ? "#000" : "#fff";
}

export function colorText(isDarkMode: Boolean) {
  return isDarkMode ? "#fff" : "#000";
}

export function boxShadow(isDarkMode: Boolean) {
  return isDarkMode ? "#7E60BF" : "#000";
}

export function useGlobalStyles() {
  const isDarkMode = useTheme(); // Usa el hook de tema

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colorContainer(isDarkMode),
        alignItems: 'center',
        justifyContent: 'center',
      },
    inputTxt : {
      backgroundColor: colorBase(isDarkMode),
      color: colorText(isDarkMode),
      justifyContent: 'center',
      padding: 5,
      minHeight:20,
      borderRadius: 7
    },
    text: {
        color: colorText(isDarkMode),
    },
    link: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: colorText(isDarkMode)
      },
    container_H :{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        textAlign: 'center',
        position:'relative'
    },
    text_container_H : {
        color: colorText(isDarkMode),
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
        shadowColor: boxShadow(isDarkMode),
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
  }, [isDarkMode]);
  return styles;
}