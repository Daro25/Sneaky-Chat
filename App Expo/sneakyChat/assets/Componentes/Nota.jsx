import { React } from "react";

export default function Nota(props) {
    return (
        <View>
            <Text>{props.title}</Text>
            <Text>{props.context}</Text>
        </View>
    );
}