import { React } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../app/recursos/style";
import { Image } from 'expo-image';

export default function NotaView(props) {
    const PlaceholderImage = require(src(props.categoria));
    return (
        <View style={[styles.nota, [,{backgroundColor:bgcolor(props.categoria)}]]}>
            <Image style={styles.image} src={PlaceholderImage}/>
            <Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>{props.title}</Text>
            <Text style={[useGlobalStyles().text]}>{props.context}</Text>
        </View>
    );
}
function src(i){
    switch (i) {
        case 1: return '@/assets/images/punto.png'
        case 2: return '@/assets/images/corona.png'
        case 3: return '@/assets/images/casa.png'
        case 4: return '@/assets/images/moneda.png'
        case 5: return '@/assets/images/escuela.png'
        case 6: return '@/assets/images/chamba.png'
        default: return '@/assets/images/punto.png'
    }
}
function bgcolor(i){
    switch (i) {
        case 1: return '#9B7EBD'
        case 2: return '#FAEDCB'
        case 3: return '#9B7EBD'
        case 4: return '#C9E4DE'
        case 5: return '#C6DEF1'
        case 6: return '#F7D9C4'
        default: return '#9B7EBD'
    }
}
const styles = StyleSheet.create ({
    nota :{
        borderRadius: 10,
        padding: 10,
        width: '80%',
        height: 'auto',
        minHeight: 70,
        marginHorizontal: '10%',
        marginVertical: 10
    },
    image: {
        width: 9,
        height: 9,
        position: 'absolute',
        top: 5,
        right: 5
    }
});