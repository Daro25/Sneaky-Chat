import { React } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useGlobalStyles } from "@/app/recursos/style";

export function MensajeLeft(props) {
    const styles2 = useGlobalStyles(); // <--- Llamado siempre
    return (
        <View style={styles.container}>
            <View style={[styles.mensaje, styles.leftAlignedContainer]}>
                <Text style={styles.fecha}>{props.fecha}</Text>
                <Text style={[styles2.text, styles2.negrita]}>{props.user}</Text>
                <Text style={[styles2.text, styles.text]}>{props.context}</Text>
                <Text style={styles.hora}>{props.hora}</Text>
            </View>
        </View>
    );
}
export function MensajeRight(props) {
    const styles2 = useGlobalStyles(); // <--- Llamado siempre
    return (
        <View style={styles.container}>
            <View style={[styles.mensaje, styles.rightAlignedContainer]}>
                <Text style={styles.fecha}>{props.fecha}</Text>
                <Text style={[styles2.text, styles2.negrita]}>{props.user}</Text>
                <Text style={[styles2.text, styles.text]}>{props.context}</Text>
                <Text style={styles.hora}>{props.hora}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create (
    {
        container: {
            height:'auto',
            position: 'relative',
            margin:20,
            width:'100%'
        },
        fecha: {
            position:'absolute',
            top: 7,
            right: 7,
            color: '#a9a9a9',
        },
        hora: {
            position:'absolute',
            bottom: 7,
            left: 7,
            color: '#a9a9a9',
        },
        rightAlignedContainer: {
            alignSelf: 'flex-end',
            backgroundColor: '#9B7EBD',
            position: 'relative',
            marginEnd:  10
        },
        leftAlignedContainer: {
            alignSelf: 'flex-start',
            backgroundColor: '#7E60BF',
            position: 'relative'
        },
        mensaje: {
            padding: 10,
            borderRadius: 9,
            width: '60%',
            height: 'auto',
            minHeight: 70,
            position: 'relative',
        },
        text: {
            marginBottom: 20
        }
    }
);