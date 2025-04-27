import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Alert, PixelRatio } from 'react-native';
import  { MensajeLeft, MensajeRight } from '@/assets/Componentes/mensaje'
import { useGlobalStyles, head } from "./recursos/style";
import { Image } from 'expo-image';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq, gt } from 'drizzle-orm';
import { RSA } from 'react-native-rsa-native';
import * as SecureStore from 'expo-secure-store';
import NetInfo from "@react-native-community/netinfo";

const ChatScreen = () => {
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
    const [emisorName, setEmisorName] = useState('');
    const [messages, setMessages] = useState<{idS: number,id: number; userId: string; fecha: string; hora: string; text: string; isCurrentUser: boolean; }[]>([]);
    const [lastId, setLastId] = useState(0);
    const isDev = __DEV__;
    const [conectado, setConectado] = useState(false);
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
        if (isDev) {
            if (title.length > 0) {
                let str = '';
                title.forEach(s => {
                    str += (s+'-')
                });
                addAlert(str, message)
            } else {
                addAlert('Info',message)
            }
            mostrarAlert(poss);
        }
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
    }, [messages]); // Dependencia en messages para ejecutar el efecto cuando cambian los mensajes
    const consulta = async ()=>{
        try {
            await consultaMensajes();
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,1], message);
        }
        try {
            const salaResult = await drizzleDb.select().from(schema.salas);
            setSala(salaResult[0].nombre);
            setPassSala(salaResult[0].pass);
            setSalaId(salaResult[0].idSala || 0);
            if (salaId) {
                await consultaSala()
            }
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,2], message);
        }
        try {
            const userResult = await drizzleDb.select().from(schema.datosp);
            setName(userResult[0].idUser);
            setPassUser(userResult[0].pass);
            setNameId(userResult[0].Id_Usserver);
            if (nameId === 0) {
                await consultaUser()
            }
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,3], message);
        }
        try {
            const emisorResult = await drizzleDb.select().from(schema.emisor);
            if (emisorResult.length != 0) {
                setEmisorName(emisorResult[0].idUser);
                setKey(emisorResult[0].n);
            }
            if (keyPublic === '') {
                await consultaEmisor()
            }
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,4],message);
        }
    }
    useEffect(()=>{
        (async () => {
            try {
                await consulta();
            } catch (error) {
                handleAlert(['Error', 1], error + '');
            }
        })();
    }, [conectado]);
    //--------------------------------------------------
    const [contador, setContador] = useState(0)
    useEffect(()=>{
        const intervalo = setInterval(() => {
            setContador(contador+1);
            NetInfo.addEventListener(state=>{
                setConectado(state.isConnected || false);
            })
            consultaMensajes();
        }, 10000);
        return ()=>{
            clearInterval(intervalo);
        };
    }, [contador]);
    //----------------------------------------------------
    const digitMSJ = async()=>{
        const textoVoid = '';
        if (true) {
            if ( texto.trim()){
                try {
                    if (keyPublic === ''|| salaId === 0 || nameId === 0 || name === '') {
                        await consulta();
                    } else {
                        setText(textoVoid);
                        const newTexto = await RSA.encrypt(texto, keyPublic);
                        const url1 = `https://ljusstudie.site/registro_mensaje.php?sala_Id=${salaId}&User_Id=${nameId}&Texto=${encodeURIComponent(newTexto)}`;
                        const response = await fetch(url1);
                        if (!response.ok) { handleAlert(['Error',2,1,1],`HTTP error! status: ${response.status}`);} else {
                            try {
                                const dataC = await response.json();
                                if(dataC?.ID){
                                    await drizzleDb.insert(schema.mensaje).values({ 
                                        idUser: name,
                                        idServer: dataC.ID,
                                        sala: sala,
                                        dates: dataC.FechayHora,
                                        texto: texto,
                                    });
                                } else {
                                    handleAlert(['Error',2,1,2], 'No se registró nada en la base de datos local');
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
                }
        }
        }
            async function consultaSala() {
                if (true) {
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
            }
            async function consultaUser() {
                if (true) {
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
            }
            async function consultaEmisor() {
                if (true) {
                    const result = await drizzleDb.select().from(schema.emisor);
                    const urlUss = `https://ljusstudie.site/ConsultaUsuarioWsala.php?id_sala=${salaId}`;
                    if (result.length === 0) {
                        const consultaU = await fetch(urlUss);
                        if (!consultaU.ok) { handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                        } else {
                            const dataU = await consultaU.json();
                            if (dataU.length > 1) {
                                const emisor =  elegirEmisor(dataU);
                                if (emisor != null) {
                                    await drizzleDb.insert(schema.emisor).values({
                                        idUsserver: Number(emisor.Id_User),
                                        n: emisor.KeyPublic,
                                        idUser: emisor.Nomb
                                    });
                                    handleAlert([],'User encontrado');
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
                            if(dataU.length > 1){
                                const emisor =  elegirEmisor(dataU);
                                if (emisor != null) {
                                    await drizzleDb.update(schema.emisor).set({n: emisor.KeyPublic}).where(eq(schema.emisor.id, result[0].id));
                                    handleAlert([],'User encontrado');
                                }
                            }
                        }
                    }
                }
            }
            const elegirEmisor = (usuarios: any[]) => {
                for (let usuario of usuarios) {
                    if (usuario.Id_User !== nameId) {
                        setEmisorName(usuario.Nomb);
                        setKey(usuario.KeyPublic);
                        return usuario;
                    }
                }
                return null;
            };
            const [errorKey, setErrorKey] = useState(false);
            async function consultaMensajes() {
                let newMsj: {idS: number, id: number; userId: string; fecha: string; 
                        hora: string; text: string; isCurrentUser: boolean; } []= [];
                let ids : number[] = [0];
                try {
                    const result = await drizzleDb.select().from(schema.mensaje).where(gt(schema.mensaje.id,lastId));
                    if (result.length>0) {
                        for (const msj of result) {
                            const date = new Date(msj.dates);
                            const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                            const hora = date.toLocaleTimeString();
                            const msjconvert = {
                                idS: msj.idServer,
                                id: msj.id, userId: msj.idUser, fecha: fecha,
                                hora: hora, text: msj.texto, 
                                isCurrentUser: msj.idUser === emisorName,
                            }
                            setLastId(msj.id);
                            ids.push(msj.idServer);
                            newMsj.push(msjconvert);
                        }
                        setMessages((prevMsj)=>{
                            const existingIds = new Set(prevMsj.map(m => m.id));
                            const filteredNewMessages = newMsj.filter(m => !existingIds.has(m.id));
                            return [...prevMsj, ...filteredNewMessages];
                        });
                    }
                } catch (error) {
                    const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                    handleAlert(['Error',3,1],message);
                }
                if (true) {
                    try {
                        const sizeM = Math.round(messages.length/0.7);
                        const sizeMidle = messages.length-sizeM<20?sizeM:messages.length-20;
                        const size = messages.length;
                        const lastid = size>0 ? newMsj[size>1? sizeMidle : 0].idS : 0;
                        //const msss = useFetchMessages(nameId, lastid, name, emisorName, salaId);
                        const urlMss = `https://ljusstudie.site/Consulta.php?sala=${salaId}&Id=${lastid}`;
                        const consultaM = await fetch(urlMss);
                        if (!consultaM.ok) { handleAlert([], `HTTP error! statusU1: ${consultaM.status}`);
                        } else {
                            const msss = await consultaM.json();
                            const llavePrivada = await SecureStore.getItemAsync('llavePrivada');
                            if(llavePrivada && !errorKey){Alert.alert('ErrorKey', 'No se encontró tu llave privada.'); setErrorKey(true)}
                            if (msss.length > 0 && llavePrivada) {
                                for await (const mss of msss) {
                                    if (!ids.includes(mss.idS)) {
                                        try {
                                            let newText = await RSA.decrypt(mss.Texto, llavePrivada);
                                            await drizzleDb.insert(schema.mensaje).values({ 
                                                idUser: Number(mss.User_id) === nameId? name : emisorName,
                                                idServer: Number(mss.ID),
                                                sala: sala,
                                                dates: mss.FechayHora,
                                                texto: newText,
                                            });
                                        } catch(error){}
                                    }
                                }
                            }}
                    } catch (error) {
                        const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                        handleAlert(['Error',3,2],message);
                    }
                }
                try {
                    if (messages.length>1) {
                        setMessages(messages.sort((a, b)=> a.idS - b.idS));
                    }
                } catch (error) {
                    const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                    handleAlert(['Error',3,3],message);
                }
            } 
    try {
        return (
            <View style={[useGlobalStyles().container, [,{overflowX:'hidden'}]]}>
                <FlatList style={{width:'101%', position:'relative', marginTop: 20}}
                    ref={flatListRef} // Asigna la referencia a FlatList
                    data={messages} // Datos de los mensajes obtenidos
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
                    onPress={digitMSJ}>
                        <Image source={require('@/assets/images/enviar.png')}
                        style={{
                              width: PixelRatio.getPixelSizeForLayoutSize(10),
                              height: PixelRatio.getPixelSizeForLayoutSize(10),
                              borderRadius: '50%'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } catch (error) {
        return(<Text>{(error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error)}</Text>);
    }
};

export default ChatScreen;