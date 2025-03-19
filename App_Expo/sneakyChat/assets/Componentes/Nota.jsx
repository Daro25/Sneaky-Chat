import { React } from "react";
import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../app/recursos/style";

export default function NotaView(props) {
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title]}>{props.title}</Text>
            <Text style={[styles.text, globalStyles.text]}>{props.context}</Text>
        </View>
    );
}
const styles = StyleSheet.create (
    {
        container: {
            height:'auto',
            position: 'relative',
            margin:10,
            width:'80%',
            minHeight: 70,
            padding: 10,
            borderRadius: 9,
            position: 'relative',
            backgroundColor: '#9B7EBD',
        },
        text: {
            marginBottom: 20
        }
    }
);