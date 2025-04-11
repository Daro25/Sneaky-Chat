import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, PixelRatio, Alert } from 'react-native';
import useFetchMessages from './useFetchMessages';
import  { MensajeLeft, MensajeRight } from '@/assets/Componentes/mensaje'
import { useGlobalStyles, head } from "./recursos/style";
import { Image } from 'expo-image';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { encryptMessage } from './recursos/cripto';

const ChatScreen = () => {
    var messages = useFetchMessages(); // Llamada al hook personalizado para obtener los mensajes
    const flatListRef = useRef<FlatList>(null); // Referencia a FlatList para controlar el desplazamiento
    const [initialLoad, setInitialLoad] = useState(0);
    const [texto, setText] = useState('');
    const [name, setName] = useState("");
    const [sala, setSala] = useState("");
    const [nameId, setNameId] = useState("");
    const [salaId, setSalaId] = useState("");
    const [keyPublic, setKeyPublic] = useState('')
    //base de datos mas facil con drizzle
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    // useEffect para desplazar automáticamente la lista al final cuando se añaden nuevos mensajes
    useEffect(() => {
        if (initialLoad < 4 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
            setInitialLoad(initialLoad+1)
        }
    }, [messages]); // Dependencia en messages para ejecutar el efecto cuando cambian los mensajes
    useEffect(()=>{
        const consulta = async ()=>{
            const userResult = await drizzleDb.select().from(schema.datosp);
            const salaResult = await drizzleDb.select().from(schema.salas);
            setName(userResult[0].idUser);
            setSala(salaResult[0].nombre);
            const consultaU = await fetch(`https://ljusstudie.site/Consulta_Usuario.php?nombre='${encodeURIComponent(name)}'&pass='${encodeURIComponent(userResult[0].pass)}'`);
            if (!consultaU.ok) { Alert.alert(`HTTP error! status1U: ${consultaU.status}`);}
            const dataU = await consultaU.json();
            setNameId(dataU[0].Id_User)
            setKeyPublic(dataU[0].KeyPublic)
            const consulta = await fetch(`https://ljusstudie.site/Consulta_Sala.php?nombre='${encodeURIComponent(sala)}'&pass='${encodeURIComponent(salaResult[0].pass)}'`);
            if (!consulta.ok) { Alert.alert(`HTTP error! status1S: ${consulta.status}`);}
            const data = await consulta.json();
            setSalaId(data[0].ID_Sala)
            messages = useFetchMessages();
        }
        try {
            consulta();
        } catch (error) {
            Alert.alert(
                "Error:", // Title of the alert
                error+'', // Message of the alert
                [
                    {text: "OK", style: 'cancel'}
                ],
                { cancelable: true }
            );
        }
    }, []);
    const digitMSJ = async()=>{
        if ( texto.trim())
        {
            setText(encryptMessage(texto, keyPublic)+'')+'';
            const response = await fetch(`https://ljusstudie.site/registro_mensaje.php?sala_Id=${salaId}&User_Id=${nameId}&Texto=${encodeURIComponent(texto)}`);
            if (!response.ok) { Alert.alert(`HTTP error! status1111: ${response.status}`);}
            const data = await response.json();
            const consulta = await fetch(`https://ljusstudie.site/Consulta.php?sala=${salaId}&Id=${0}`);
            if (!consulta.ok) {Alert.alert(`HTTP error! status2: ${consulta.status}`);}
            const dataC = await consulta.json();
            if(data[0].resultado != 'Registro de sala exitoso.'){
                Alert.alert("Error:", data[0].resultado);} 
            else {
                    setText(' ');
                    await drizzleDb.insert(schema.mensaje).values({ 
                        idUser: nameId+'',
                        idServer: dataC[0].ID,
                        sala: salaId,
                        dates: dataC[0].FechayHora,
                        texto: texto,
                    });
                }
            }}
    return (
        <View style={[useGlobalStyles().container, [,{overflowX:'hidden'}]]}>
            <FlatList style={{width:'101%', position:'relative'}}
                ref={flatListRef} // Asigna la referencia a FlatList
                data={messages} // Datos de los mensajes obtenidos
                keyExtractor={(item) => item.id.toString()} // Clave única para cada mensaje
                renderItem={({ item }) => (
                    item.isCurrentUser ? 
                    <MensajeRight 
                    user= {item.userId}
                    fecha= {item.fecha}
                    context= {item.text}
                    hora= {item.hora}/> 
                    : 
                    <MensajeLeft
                    user= {item.userId}
                    fecha= {item.fecha}
                    context= {item.text}
                    hora= {item.hora}/> 
                )}
            />
            <TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().center, useGlobalStyles().inlineBlock, [,{position:'absolute',right:7, backgroundColor: head}]]}
            onPress={() => {
                    if (flatListRef.current) {
                        flatListRef.current.scrollToEnd({ animated: true });
                    }
                }
            }>
                <Text style={[[,{color:'white'}], useGlobalStyles().negrita, useGlobalStyles().center]}>▼</Text>
            </TouchableOpacity>
            <View style={[useGlobalStyles().msjbox, useGlobalStyles().container_H]}>
                <TextInput
                value={texto}
                onChangeText={setText}
                placeholder='Digite su mensaje'
                placeholderTextColor={'#a9a9a9'}
                numberOfLines={7}
                maxLength={100}
                textAlignVertical="top"
                textAlign="left"
                multiline={true}
                style={useGlobalStyles().leyenda}/>

                <TouchableOpacity style={useGlobalStyles().msjboxBtn}
                onPress={digitMSJ}
                >
                    <Image source={require('@/assets/images/enviar.png')}
                    style={{
                          width: PixelRatio.getPixelSizeForLayoutSize(40),
                          height: PixelRatio.getPixelSizeForLayoutSize(40),
                          borderRadius: '50%'}}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;