import { React } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "@/app/recursos/style";
import { Src , Bgcolor } from "./recursos/categorias";
import { Image } from 'expo-image';

export default function NotaView(props) {
    const PlaceholderImage = Src(props.categoria);
    return (
        <View style={[styles.nota, [,{backgroundColor:Bgcolor(props.categoria)}]]}>
            <Image style={styles.image} source={PlaceholderImage}/>
            <Text style={[useGlobalStyles().text, useGlobalStyles().negrita]}>{props.title}</Text>
            <Text style={[useGlobalStyles().text]}>{props.context}</Text>
        </View>
    );
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