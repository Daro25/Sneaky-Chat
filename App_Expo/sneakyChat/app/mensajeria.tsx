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
import { eq } from 'drizzle-orm';
import RNRsaNative, { RSA } from 'react-native-rsa-native';
import { halfvec } from 'drizzle-orm/pg-core';

const ChatScreen = () => {
    var messages = useFetchMessages(); // Llamada al hook personalizado para obtener los mensajes
    const flatListRef = useRef<FlatList>(null); // Referencia a FlatList para controlar el desplazamiento
    const [initialLoad, setInitialLoad] = useState(0);
    const [texto, setText] = useState('');
    const [name, setName] = useState("");
    const [sala, setSala] = useState("");
    const [nameId, setNameId] = useState(0);
    const [salaId, setSalaId] = useState(0);
    const [passUser, setPassUser] = useState('');
    const [passSala, setPassSala] = useState('');
    const [poss, setPoss] = useState(0);
    const [alertas, setAlertas] = useState([{title: '', message:''},]);
    const [keyPublic, setKey] = useState('');
    const [emisorName, setEmisorName] = useState('')
    function addAlert(title: string, message: string) {
        setAlertas((prevAlertas)=>[...prevAlertas,{title: title, message: message}]);
    }
    function mostrarAlert(actualposs : number) {
        if (actualposs < alertas.length) {
            setPoss(actualposs)
            Alert.alert(alertas[poss].title,alertas[poss].message,
                [{
                    text: 'ok',
                    onPress: ()=>{
                        mostrarAlert(actualposs+1);
                        return;
                    }
                }]
            );
        } else {
            return;
        }
    }
    function handleAlert(title : (string | number)[], message: string) {
        if (title.length > 0) {
            let str = '';
            title.forEach(s => {
                str += (s+'.')
            });
            addAlert(str, message)
        } else {
            addAlert('Info',message)
        }
        mostrarAlert(poss);
    }
    //base de datos mas facil con drizzle
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    // useEffect para desplazar automáticamente la lista al final cuando se añaden nuevos mensajes
    useEffect(() => {
        if (initialLoad < 4 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
            setInitialLoad(initialLoad+1)
        }
        if (messages.error != '') {
            handleAlert([], messages.error);
        }
    }, [messages.messages]); // Dependencia en messages para ejecutar el efecto cuando cambian los mensajes
    const consulta = async ()=>{
        try {
            const salaResult = await drizzleDb.select().from(schema.salas);
            setSala(salaResult[0].nombre);
            setPassSala(salaResult[0].pass);
            setSalaId(salaResult[0].idSala || 0);
            await consultaSala()
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,1], message);
        }
        try {
            const userResult = await drizzleDb.select().from(schema.datosp);
            setName(userResult[0].idUser);
            setPassUser(userResult[0].pass);
            setNameId(userResult[0].Id_Usserver);
            await consultaUser()
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,2], message);
        }
        try {
            const emisorResult = await drizzleDb.select().from(schema.emisor);
            if (emisorResult.length != 0) {
                setEmisorName(emisorResult[0].idUser);
                setKey(emisorResult[0].n);
            }
            await consultaEmisor()
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,3],message);
        }
    }
    useEffect(()=>{
        try {
            consulta();
        } catch (error) {
            handleAlert(['Error',1], error+'' );
        }
    }, []);
    const digitMSJ = async()=>{
        const textoVoid = '';
        if ( texto.trim())
        {
            try {
                if (keyPublic === '') {
                    await consulta();
                } else {
                    setText(textoVoid);
                    const newTexto = await RSA.encrypt(texto, keyPublic);
                    const url1 = `https://ljusstudie.site/registro_mensaje.php?sala_Id=${salaId}&User_Id=${nameId}&Texto=${encodeURIComponent(newTexto)}`;
                    const response = await fetch(url1);
                    if (!response.ok) { handleAlert(['Error',2,1,1],`HTTP error! status: ${response.status}`);} else {
                        try {
                            const url2 = `https://ljusstudie.site/Consulta.php?sala=${sala}&Id=${0}`;
                            const consulta = await fetch(url2);
                            if (!consulta.ok) {handleAlert(['Error',2,1,2],`HTTP error! status2: ${consulta.status}`);}else{
                                const dataC = await consulta.json();
                                await drizzleDb.insert(schema.mensaje).values({ 
                                    idUser: name,
                                    idServer: dataC[0].ID,
                                    sala: sala,
                                    dates: dataC[0].FechayHora,
                                    texto: texto,
                                });
                            }
                        } catch (error) {
                            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                            handleAlert(['Error',2,1], message)
                        }
                    }
                }
            } catch (error) {
                const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                handleAlert(['Error',2], message)
            }
            }}
            async function consultaSala() {
                if (salaId === 0) {
                    const urlsala = `https://ljusstudie.site/Consulta_Sala.php?nombre=${encodeURIComponent(sala)}&pass=${encodeURIComponent(passSala)}`;
                    const consultaSala = await fetch(urlsala);
                    handleAlert([],urlsala);
                    if (!consultaSala.ok) {
                        handleAlert(['Error',1,1],`HTTP error! status: ${consultaSala.status}`);
                    } else {
                        const dataS = await consultaSala.json();
                        setSalaId(Number(dataS[0].ID_Sala));
                        const result2 = await drizzleDb.select().from(schema.salas);
                        await drizzleDb.update(schema.salas).set({idSala: Number(dataS[0].ID_Sala)}).where(eq(schema.salas.nombre, result2[0].nombre))
                    }
                }
            }
            async function consultaUser() {
                const result = await drizzleDb.select().from(schema.datosp);
                if (nameId === 0) {
                    const url = `https://ljusstudie.site/Consulta_Usuario.php?pass=${encodeURIComponent(passUser)}&nombre=${encodeURIComponent(name)}`;
                    const consultaU = await fetch(url);
                    if (!consultaU.ok) { handleAlert(['Error',1,2,1],`HTTP error! status: ${consultaU.status}`);
                    } else {
                        const dataU = await consultaU.json();
                        if (dataU.length > 0) {
                            await drizzleDb.update(schema.datosp).set({Id_Usserver: Number(dataU[0].Id_User)}).where(eq(schema.datosp.idUser, name))
                            handleAlert([url],dataU);
                            setNameId(Number(dataU[0].Id_User));
                        }else{
                            handleAlert([],url)
                        }
                    }
                }
            }
            async function consultaEmisor() {
                const result = await drizzleDb.select().from(schema.emisor);
                const urlUss = `https://ljusstudie.site/ConsultaUsuarioWsala.php?id_sala=${salaId}`;
                if (result.length === 0) {
                    const consultaU = await fetch(urlUss);
                    if (!consultaU.ok) { handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                    } else {
                        const dataU = await consultaU.json();
                        if (dataU.length > 1) {
                            for (let i = 0; i < dataU.length; i++) {
                                const element = dataU[i];
                                if (element.Id_User != nameId) {
                                    setEmisorName(element.Id_User);
                                    setKey(element.KeyPublic);
                                    await drizzleDb.insert(schema.emisor).values({
                                        idUsserver: Number(element.Id_User),
                                        n: element.KeyPublic,
                                        idUser: element.Nomb
                                    });
                                    handleAlert([],'User encontrado');
                                    break;
                                }
                            }
                        } else {
                            handleAlert(['Error'], 'No se encontró al emisor');
                        }
                    }
                } else if (result.length > 0 && keyPublic === '') {
                    const consultaU = await fetch(urlUss);
                    if (!consultaU.ok) { handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                    } else {
                        const dataU = await consultaU.json();
                        for (let i = 0; i < dataU.length; i++) {
                            const element = dataU[i];
                            handleAlert([],'User encontrado');
                            if (element.Id_User != nameId) {
                                setEmisorName(element.Id_User);
                                setKey(element.KeyPublic);
                                await drizzleDb.update(schema.emisor).set({n: element.KeyPublic}).where(eq(schema.emisor.id, result[0].id));
                                break;
                            }
                        }
                    }
                }
            }
    return (
        <View style={[useGlobalStyles().container, [,{overflowX:'hidden'}]]}>
            <FlatList style={{width:'101%', position:'relative'}}
                ref={flatListRef} // Asigna la referencia a FlatList
                data={messages.messages} // Datos de los mensajes obtenidos
                keyExtractor={(item) => item.id.toString()} // Clave única para cada mensaje
                renderItem={({ item }) => (
                    item.isCurrentUser ? 
                    <MensajeRight 
                    user= {emisorName}
                    fecha= {item.fecha}
                    context= {item.text}
                    hora= {item.hora}/> 
                    : 
                    <MensajeLeft
                    user= {name}
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