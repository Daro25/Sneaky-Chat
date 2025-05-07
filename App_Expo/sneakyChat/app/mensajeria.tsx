import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Alert, PixelRatio } from 'react-native';
import  { MensajeLeft, MensajeRight } from '@/assets/Componentes/mensaje'
import { useGlobalStyles, head } from "./recursos/style";
import { Image } from 'expo-image';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, eq, gt, not, notInArray, sql } from 'drizzle-orm';
import { RSA } from 'react-native-rsa-native';
import * as SecureStore from 'expo-secure-store';
//import NetInfo from "@react-native-community/netinfo";

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
    const [keyPublics, setKeys] = useState <string[]>([]);
    const [emisorName, setEmisorName] = useState('');
    const [llavePrivada, setKeyPriv] = useState('');
    const [messages, setMessages] = useState<{idS: number,id: number; userId: string; fecha: string; hora: string; text: string; isCurrentUser: boolean; }[]>([]);
    const isDev = __DEV__;
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
                await consultaEmisor(false)
            }
        } catch (error) {
            const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
            handleAlert(['Error',1,4],message);
        }
        try {
            const llavePrivadaS = await SecureStore.getItemAsync('llavePrivada') || '';
            setKeyPriv(llavePrivadaS);
        } catch (error) {
            
        }
        try {
            await consultaMensajes();
        } catch (error) {
            
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
    }, []);
    //--------------------------------------------------
    const [contador, setContador] = useState(0)
    useEffect(() => {
        setTimeout(() => {
          consultaMensajes();
          setContador(prev => prev + 1);
        }, 1000);
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
                        if (keyPublics.length == 0 || name === emisorName) {
                            await consultaEmisor(true);
                        }
                        for await (const keyPub of keyPublics) {
                            const newTexto = await RSA.encrypt(texto, keyPub);
                            const url1 = `https://ljusstudie.site/registro_mensaje.php?sala_Id=${salaId}&User_Id=${nameId}&Texto=${encodeURIComponent(newTexto)}`;
                            const response = await fetch(url1);
                            if (!response.ok) handleAlert(['Error',2,1,1],`HTTP error! status: ${response.status}`);
                            if (!response.ok) Alert.alert('Error de envio de mensaje', 'Error de conección.');
                        }
                    }
                } catch (error) {
                    const message = (error instanceof Error)? `${error.message}\n\nStack:\n${error.stack}`:JSON.stringify(error);
                    Alert.alert('Error de envio de mensaje', 'Ocurrio un error al enviar el mensaje');
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
            async function consultaEmisor(bolovan: boolean) {
                if (true) {
                    const result = await drizzleDb.select().from(schema.emisor);
                    const urlUss = `https://ljusstudie.site/ConsultaUsuarioWsala.php?id_sala=${salaId}`;
                    const consultaU = await fetch(urlUss);
                    const dataU = await consultaU.json();
                    setKey(elegirEmisor(dataU));
                    if (result.length === 0) {
                        if (!consultaU.ok) { handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                        } else {
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
                                if (contador === 2) {
                                    Alert.alert('Error', 'no podrás enviar mensaje hasta que otro usuario se una a la sala');
                                }
                            }
                        }
                    } else if (result.length > 0 && keyPublic === '' || bolovan || emisorName === name) {
                        const consultaU = await fetch(urlUss);
                        if (!consultaU.ok) { handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                        } else {
                            const dataU = await consultaU.json();
                            if(dataU.length > 1){
                                const emisor =  elegirEmisor(dataU);
                                if (emisor != null) {
                                    await drizzleDb.update(schema.emisor).set({n: emisor.KeyPublic, idUser: emisor.idUser, idUsserver: emisor.idUsserver}).where(eq(schema.emisor.id, result[0].id));
                                    handleAlert([],'User encontrado');
                                }
                            }
                        }
                    }
                }
            }
            const elegirEmisor = (usuarios: any[]) => { 
                let keys:string[] = []
                let usuarioOne = null
                for (let usuario of usuarios) {
                    keys.push(usuario.KeyPublic)
                    setKeys(keys);
                    if (!(usuario.Id_User === nameId)) {
                        setEmisorName(usuario.Nomb);
                        setKey(usuario.KeyPublic);
                        usuarioOne = usuario;
                    }
                }
                return usuarioOne;
            };
            async function consultaMensajes() {
                let newMsj: { idS: number, id: number; userId: string; fecha: string;
                  hora: string; text: string; isCurrentUser: boolean; }[] = [];
                let processedServerIds: Set<number> = new Set(); // Usaremos un Set para eficiencia en la búsqueda
              
                try {
                  const localMessagesResult = await drizzleDb.select().from(schema.mensaje);
                  if (localMessagesResult.length > 0) {
                    for (const msj of localMessagesResult) {
                      const date = new Date(msj.dates);
                      const fecha = date.toLocaleDateString();
                      const hora = date.toLocaleTimeString();
                      const msjconvert = {
                        idS: msj.idServer,
                        id: msj.id,
                        userId: msj.idUser,
                        fecha: fecha,
                        hora: hora,
                        text: msj.texto,
                        isCurrentUser: (msj.idUser != emisorName),
                      };
                      processedServerIds.add(msj.idServer); // Almacenamos los IDs locales para evitar duplicados al sincronizar
                      newMsj.push(msjconvert);
                    }
                    newMsj.sort((a, b) => a.idS - b.idS);
                    setMessages(newMsj);
                  }
                } catch (error) {
                  const message = (error instanceof Error) ? `${error.message}\n\nStack:\n${error.stack}` : JSON.stringify(error);
                  handleAlert(['Error', 3, 1], message);
                }
              
                try {
                  //const latestServerId = messages.length > 5 ? messages[messages.length - 5].idS : 0;
                  const urlMss = `https://ljusstudie.site/Consulta.php?sala=${salaId}&Id=0`;
                  const consultaM = await fetch(urlMss);
                  if (!consultaM.ok) {
                    handleAlert([], `HTTP error! statusU1: ${consultaM.status}`);
                  } else {
                    const msss = await consultaM.json();
                    if (llavePrivada === '' && contador === 2) {
                      const actualice = async () => {
                        const keys = await RSA.generateKeys(512);
                        await SecureStore.setItemAsync('llavePrivada', keys.private);
                        const urlUp = `https://ljusstudie.site/Update_Usuario.php?key=${encodeURIComponent(keys.public)}&pass=${encodeURIComponent(passUser)}&nombre=${encodeURIComponent(name)}`;
                        const updateU = await fetch(urlUp);
                        if (!updateU.ok) {
                          Alert.alert('Error', `HTTP error! status: ${updateU.status}`);
                        } else {
                          const dataUp = await updateU.json();
                          if (Number(dataUp?.Num) > 0) {
                            Alert.alert('Acción:', 'Se actualizo correctamente');
                          } else Alert.alert('Acción:', 'No fue logrado, revisa tu conexión de internet');
                        }
                      };
                      Alert.alert('Key Error', 'Tu Llave privada no se encontró, actualiza tu llave privada',
                        [{ text: "Actualizar", style: 'cancel', onPress: async () => await actualice() }],
                        { cancelable: false });
                    }
                    if (llavePrivada === '') {
                      const llavePrivadaS = await SecureStore.getItemAsync('llavePrivada') || '';
                      setKeyPriv(llavePrivadaS);
                    }
                    if (msss.length > 0 && llavePrivada) {
                      for await (const mss of msss) {
                        if (!processedServerIds.has(Number(mss.ID))) { // Verificamos si ya procesamos este ID del servidor
                          try {
                            let newText = await RSA.decrypt(mss.Texto, llavePrivada).catch(() => null); // Manejar errores de desencriptación
                            if (newText !== null) {
                              await drizzleDb.insert(schema.mensaje).values({
                                idUser: Number(mss.User_id) === nameId ? name : emisorName,
                                idServer: Number(mss.ID),
                                sala: sala,
                                dates: mss.FechayHora,
                                texto: newText,
                              });
                              // No es necesario actualizar el estado 'messages' aquí en cada inserción,
                              // se actualizará en la próxima llamada a 'consultaMensajes'
                            }
                          } catch (error) {
                            console.error("Error al insertar o desencriptar mensaje:", error);
                          }
                        }
                      }
                      // Después de insertar los nuevos mensajes, podrías volver a cargar la lista completa
                      correctDuplicateMessages();
                    }
                  }
                } catch (error) {
                  const message = (error instanceof Error) ? `${error.message}\n\nStack:\n${error.stack}` : JSON.stringify(error);
                  handleAlert(['Error', 3, 2], message);
                }
              }
              
              // Función para eliminar mensajes duplicados basada en idServer
            async function correctDuplicateMessages() {
                try {
                    const messagesDB = await drizzleDb.select().from(schema.mensaje);
                    const uniqueMess = removeDuplicateMessages(messagesDB);

                    if (uniqueMess.length > 0 && messagesDB.length > uniqueMess.length) {
                    for await (const element of uniqueMess) {
                        const deleteResult = await drizzleDb.delete(schema.mensaje)
                        .where(and(eq(schema.mensaje.idServer, element.idServer), not(eq(schema.mensaje.id, element.id))));
                        console.log(`Removed ${deleteResult.changes} duplicate messages (using Drizzle V2).`);
                    }
                    } else {
                    console.log('No duplicate messages found with Drizzle V2.');
                    }
                } catch (error) {
                    console.error('Error correcting duplicate messages with Drizzle V2:', error);
                }
            }
            function removeDuplicateMessages(message: schema.Msj[]) {
                const uniqueMessagesMap = new Map();
                const uniqueMessages: typeof message = [];
              
                for (const mess of message) {
                  const uniqueKey = `${mess.idServer}`;
                  if (!uniqueMessagesMap.has(uniqueKey)) {
                    uniqueMessagesMap.set(uniqueKey, true);
                    uniqueMessages.push(mess);
                  }
                }
              
                return uniqueMessages;
              }
    try {
        return (
            <View style={[useGlobalStyles().container, [,{overflowX:'hidden'}]]}>
                <FlatList style={{width:'100%', position:'relative', marginTop: 20}}
                    ref={flatListRef} // Asigna la referencia a FlatList
                    data={messages} // Datos de los mensajes obtenidos
                    keyExtractor={(item) => item.id + ''} // Clave única para cada mensaje
                    renderItem={({ item }) => (
                        item.isCurrentUser || item.userId != emisorName ? 
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