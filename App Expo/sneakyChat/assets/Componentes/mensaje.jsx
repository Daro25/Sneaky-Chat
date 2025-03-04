import { React } from "react";

export default function Mensaje(props) {
    return (
        <View>
            <Text>{props.fecha}</Text>
            <Text>{props.user}</Text>
            <Text>{props.context}</Text>
            <Text>{props.hora}</Text>
        </View>
    );
}