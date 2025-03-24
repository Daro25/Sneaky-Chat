import { React, useState} from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGlobalStyles } from "@/app/recursos/style";
import { Src , Bgcolor, basura } from "@/app/recursos/categorias";
import { Image } from 'expo-image';

export default function NotaView(props) {
    const PlaceholderImage = Src(props.categoria);
    const [transparent, setTransparent] = useState('FF');
    const [deleteN, setDeleteN] = useState(false);
    const deseleccion = () => {
        setTransparent('FF')
        setDeleteN(false)
    };
    const seleccion = ()=> {
        setTransparent('7F');
        setDeleteN(true);
        setTimeout(deseleccion, 7000);
    };
    return (
        <View style={[styles.nota, [,{backgroundColor:Bgcolor(props.categoria)+transparent, position:'relative', overflow:'hidden'}]]}>
        <TouchableOpacity style={{position:'relative', width:'100%', 
        height: 'auto', minHeight: 120, borderRadius: 10, padding: 10,}}
        onLongPress={seleccion} onPress={deseleccion}>
            <Image style={styles.image} source={PlaceholderImage}/>
            <Text style={[[{color:'black'}], useGlobalStyles().negrita]}>{props.title}</Text>
            <Text style={{color:'black'}}>{props.context}</Text>
        </TouchableOpacity>
            {
                deleteN &&(
                    <View style={{
                        position: 'absolute',
                        top:0,
                        left:0,
                        width:'100%',
                        height:'100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:'#0000007F',
                        zIndex: 1
                    }}>
                        <TouchableOpacity onPress={props.delete(props.id)}
                        style={{width: 70, height:70, borderRadius: '50%', borderWidth: 2, borderColor: 'white'}}>
                            <Image source={basura} style={{width: 70, height:70}}/>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    );
}
const styles = StyleSheet.create ({
    nota :{
        borderRadius: 10,
        width: '80%',
        height: 'auto',
        minHeight: 120,
        marginHorizontal: '10%',
        marginVertical: 10
    },
    image: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 5,
        right: 5
    }
});