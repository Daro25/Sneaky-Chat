import { React } from "react";
import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../app/recursos/style";

export default function Nota(props) {
    return (
        <View>
            <Text>{props.title}</Text>
            <Text>{props.context}</Text>
        </View>
    );
}