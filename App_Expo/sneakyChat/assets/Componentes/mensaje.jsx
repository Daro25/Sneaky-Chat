import { React } from "react";
import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../app/recursos/style";

export function MensajeLeft(props) {
    return (
        <View style={styles.container}>
            <View style={styles.mensaje}>
                <Text style={styles.fecha}>{props.fecha}</Text>
                <Text style={[globalStyles.text, globalStyles.negrita]}>{props.user}</Text>
                <Text style={globalStyles.text}>{props.context}</Text>
                <Text style={styles.hora}>{props.hora}</Text>
            </View>
        </View>
    );
}
export function MensajeRight(props) {
    return (
        <View style={styles.container}>
            <View style={[styles.mensaje, styles.rightAlignedContainer]}>
                <Text style={styles.fecha}>{props.fecha}</Text>
                <Text style={[globalStyles.text, globalStyles.negrita]}>{props.user}</Text>
                <Text style={globalStyles.text}>{props.context}</Text>
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
        },
        mensaje: {
            padding: 10,
            borderRadius: 9,
            width: '60%',
            height: 'auto',
            minHeight: 70,
            position: 'relative'
        }
    }
);