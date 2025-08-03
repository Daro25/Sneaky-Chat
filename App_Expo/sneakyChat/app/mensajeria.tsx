import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Alert, PixelRatio } from 'react-native';
import  { MensajeLeft, MensajeRight } from '@/assets/Componentes/mensaje';
import { LinearGradient } from 'expo-linear-gradient';
import colorBase, { useGlobalStyles, head, useTheme, colorContainer } from "./recursos/style";
import { Image } from 'expo-image';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, eq, gt, isNull, not, notInArray, or, sql } from 'drizzle-orm';
import { RSA } from 'react-native-rsa-native';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';

const ChatScreen = () => {
    const flatListRef = useRef<FlatList>(null); // Referencia a FlatList para controlar el desplazamiento
    const animation = useRef<LottieView>(null);
    const [phase, setPhase] = useState<'intro' | 'loop' | 'finish' | 'hidden'>('intro');
    const [onload, setOnload] = useState(false); // esto lo activas desde fuera
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
    const [length, setLength] = useState(0);
    const [diference, setDiference] = useState(0);
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
    const [deslice, setDeslice] = useState(false);
    // useEffect para desplazar automáticamente la lista al final cuando se añaden nuevos mensajes
    useEffect(() => {
        if (deslice && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
            setInitialLoad(initialLoad+1)
            setDiference(0)
        }
    }, [length]);
     // Dependencia en messages para ejecutar el efecto cuando cambian los mensajes
     useEffect(() => {
        if ((initialLoad < 4 && flatListRef.current)) {
            flatListRef.current.scrollToEnd({ animated: true });
            setInitialLoad(initialLoad+1)
            setDiference(0);
        }
    },[messages]);
    const consulta = async ()=>{ 
        async function salaResult() {
                const salaResult = await drizzleDb.select().from(schema.salas);
                setSala(salaResult[0].nombre);
                setPassSala(salaResult[0].pass);
                setSalaId(salaResult[0].idSala || 0);
                if (salaId) {
                    await consultaSala()
                }
        }
        async function userResult() {
                const userResult = await drizzleDb.select().from(schema.datosp);
                setName(userResult[0].idUser);
                setPassUser(userResult[0].pass);
                setNameId(userResult[0].Id_Usserver);
                if (nameId === 0) {
                    await consultaUser()
                }
        }
        async function emisorResult() {
                const emisorResult = await drizzleDb.select().from(schema.emisor);
                if (emisorResult.length != 0) {
                    setEmisorName(emisorResult[0].idUser);
                    setKey(emisorResult[0].n);
                }
                if (keyPublic === '') {
                    await consultaEmisor(false)
                }
        }
        async function setLlavePriv() {
                const llavePrivadaS = await SecureStore.getItemAsync('llavePrivada') || '';
                setKeyPriv(llavePrivadaS);
        }
        try {
            const tareas = [salaResult(), userResult(), setLlavePriv()];
            await Promise.all(tareas);
            await emisorResult();
            await consultaMensajes();
        } catch (error) {
            
}
    }
//--------------------Ejecuta la primera consulta y se ejecuta una vez----
    useEffect(() => {
    if (animation.current && phase === 'intro') {
        animation.current.play(0, 35); // Introducción
    }
    }, [phase]);
    useEffect(() => {
    if (onload && phase === 'loop') {
        animation.current?.play(45, 149); // transición de salida
        setPhase('finish');
    }
    }, [onload, phase]);
    const handleFinish = () => {
    if (phase === 'intro') {
        animation.current?.play(35, 45); // comienza loop
        setPhase('loop');
    } else if (phase === 'loop' && !onload) {
        animation.current?.play(35, 45); // sigue repitiendo si no se ha cargado
    } else if (phase === 'finish') {
        setPhase('hidden'); // ya se puede ocultar
    }
    };
    
    const isdarck = useTheme();
    const [colorBase, setcolorBase] = useState("#25292e");
    useEffect(()=>{
        (async () => {
          setcolorBase(colorContainer(isdarck))
            try {
                await consulta();
                // cuando termina de cargar:
                setOnload(true);
                setEnvio(true);
            } catch (error) {
                handleAlert(['Error', 1], error + '');
            }
        })();
    }, []);
//--------------------Funcion que se repite cada segundo-------------------
    const [contador, setContador] = useState(0)
    const [ envio, setEnvio] = useState(false);
    useEffect(() => {
        setTimeout(() => {
          if (keyPublic === ''|| salaId === 0 || nameId === 0 || name === '' || emisorName.trim()=='' || !salaId || !name || !keyPublic || !nameId || !emisorName) {
            consulta();
          } else {
            consultaMensajes();
          }
          setContador(prev => prev + 1);
        }, 1000);
      }, [contador]);
//------------------------------------------------------------------------
    const digitMSJ = async()=>{
      setEnvio(false);
        const textoVoid = '';
        if (true) {
            if ( texto.trim()){
                try {
                    if (keyPublic === ''|| salaId === 0 || nameId === 0|| !nameId || name === '') {
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
        setEnvio(true);
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
            async function consultaEmisor(bolovan: boolean) {
              try {
                  const result = await drizzleDb.select().from(schema.emisor);
                  if (result.length>1) await drizzleDb.delete(schema.emisor).where(gt(schema.emisor.id, 1));
                  const urlUss = `https://ljusstudie.site/ConsultaUsuarioWsala.php?id_sala=${salaId}`;

                  const shouldFetchRemote =
                      result.length === 0 ||
                      bolovan ||
                      keyPublic === '' ||
                      emisorName === name ||
                      emisorName.trim() === "";

                  if (shouldFetchRemote) {
                      const consultaU = await fetch(urlUss);
                      if (!consultaU.ok) {
                          handleAlert([], `HTTP error! statusU1: ${consultaU.status}`);
                          return;
                      }

                      const dataU = await consultaU.json();
                      if (dataU.length > 1) {
                          const emisor = elegirEmisor(dataU);
                          if (emisor != null) {
                              // Insertar o actualizar
                              if (result.length === 0) {
                                  await drizzleDb.insert(schema.emisor).values({
                                      idUsserver: Number(emisor.Id_User),
                                      n: emisor.KeyPublic,
                                      idUser: emisor.Nomb
                                  });
                              } else {
                                  await drizzleDb.update(schema.emisor)
                                      .set({
                                          n: emisor.KeyPublic,
                                          idUser: emisor.Nomb,
                                          idUsserver: Number(emisor.Id_User)
                                      })
                                      .where(eq(schema.emisor.id, 1));
                              }

                              setKey(emisor.KeyPublic);
                              setEmisorName(emisor.Nomb);
                              handleAlert([], 'User encontrado');
                          }
                      } else {
                          handleAlert(['Error'], 'No se encontró al emisor');
                          if (contador === 2) {
                              Alert.alert('Error', 'no podrás enviar mensaje hasta que otro usuario se una a la sala');
                          }
                      }
                  } else {
                      // Caso en que ya hay un emisor en DB y no hace falta actualizar
                      const ultimo = result[result.length - 1];
                      setKey(ultimo.n);
                      setEmisorName(ultimo.idUser);
                  }
              } catch (error) {
                  handleAlert(['Error'], `Excepción al consultar emisor: ${error}`);
              }
          }

            const elegirEmisor = (usuarios: any[]) => { 
                let keys:string[] = []
                let usuarioOne = null
                let usuarioPrime = null
                for (let usuario of usuarios) {
                    keys.push(usuario.KeyPublic)
                    setKeys(keys);
                    if (!(usuario.Id_User === nameId)) {
                        setEmisorName(usuario.Nomb);
                        setKey(usuario.KeyPublic);
                        usuarioOne = usuario;
                    }
                    if (usuario.Id_User === nameId) {
                        usuarioPrime = usuario;
                    }
                }
                if (usuarioPrime === null) {
                  crearUsuario();
                }
                return usuarioOne;
            };

            async function crearUsuario() {
                try { 
                  const url = new URL("https://ljusstudie.site/registro_usuario.php");
                  const result = await drizzleDb.select().from(schema.datosp);
                  const datosUsuario = result[0];
                  url.searchParams.append("nomb", datosUsuario.idUser); // se usa como nombre
                  url.searchParams.append("contra", datosUsuario.pass);
                  url.searchParams.append("key", keyPublic); // clave RSA pública
                  url.searchParams.append("sala_id", salaId.toString()); // sala_id
                  url.searchParams.append("edad", datosUsuario.year.toString()); // edad = año

                  fetch(url.toString(), {
                    method: "GET",
                  })
                    .then((response) => response.json())
                    .then((json) => {
                      if (json.ID) {
                        drizzleDb.update(schema.datosp).set({Id_Usserver: json?.ID? json.ID : 0}).where(eq(schema.datosp.id, 0));
                        console.log("✅ Registro exitoso. ID:", json.ID);
                        // Aquí puedes guardar json.ID como Id_Usserver
                      } else {
                        console.log("❌ Falló el registro:", json.resultado);
                      }
                    })
                    .catch((error) => {
                      console.error("🛑 Error en el fetch:", error);
                    });
                } catch (error) {
                  console.error("🛑 Error al crear usuario:", error) ;
                }
              }
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
                    if (newMsj.length !== length) {
                      setDiference(newMsj.length - length);
                      newMsj.sort((a, b) => a.idS - b.idS);
                      setMessages(newMsj);
                      setLength(newMsj.length);
                    }
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
                            if (newText != null && (emisorName !=''||!emisorName) && mss.User_id != nameId) {
                              const urlDelete = `https://ljusstudie.site/deleteMensaje.php?id=${mss.ID}`;
                              const updateD = await fetch(urlDelete);
                              if (updateD.ok) {
                                await drizzleDb.insert(schema.mensaje).values({
                                  idUser: Number(mss.User_id) === nameId ? name : emisorName,
                                  idServer: Number(mss.ID),
                                  sala: sala,
                                  dates: mss.FechayHora,
                                  texto: newText,
                                });
                              }
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
                    await drizzleDb.delete(schema.mensaje).where(
                        or(
                            isNull(schema.mensaje.idUser),
                            eq(schema.mensaje.idUser, '')
                        )
                    );
                    console.log('Deleted messages with empty idUser.');
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
    const styles = useGlobalStyles(); // <--- Llamado siempre

return (
  <View style={[styles.container, { overflowX: 'hidden' }]}>
    {phase !== 'hidden' && (
      <View style={styles.containerLottie}>
        <LottieView
          ref={animation}
          source={require('../assets/images/CierreLoad.json')}
          style={styles.lottie}
          loop={false}
          onAnimationFinish={handleFinish}/>
          <LinearGradient
            colors={[colorBase, 'rgba(255,255,255,0)']}
            style={styles.topFade}/>

          {/* Gradiente inferior */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', colorBase]}
            style={styles.bottomFade}/>
      </View>
    )}

    {phase === 'hidden' && (
      <>
        <FlatList
          style={{ width: '100%', position: 'relative', marginTop: 20 }}
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id + ''}
          renderItem={({ item }) =>
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
          }
        />

        <TouchableOpacity
          style={[
            styles.btn_normal,
            styles.center,
            styles.inlineBlock,
            { position: 'absolute', right: 7, backgroundColor: head},
          ]}
          onPress={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
            setDiference(0);
          }}
        >
          <Text style={[{ color: 'white' }, styles.negrita, styles.center]}>▼{diference===0?'':diference}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.btnLeyendo}
            onPress={deslice ? ()=>setDeslice(false) : ()=>setDeslice(true)}
          >
            {deslice ? (
              <Image
                source={require('@/assets/images/mano.png')}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(10),
                  height: PixelRatio.getPixelSizeForLayoutSize(10),
                  borderRadius: '50%',
                }}
              />
            ) : (
            <Image
                source={require('@/assets/images/estudiar.png')}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(10),
                  height: PixelRatio.getPixelSizeForLayoutSize(10),
                  borderRadius: '50%',
                }}
              />
            )}
          </TouchableOpacity>
        <View style={[styles.msjbox, styles.container_H]}>
          <TextInput
            value={texto}
            onChangeText={setText}
            placeholder="Digite su mensaje"
            placeholderTextColor="#a9a9a9"
            numberOfLines={7}
            maxLength={100}
            textAlignVertical="top"
            textAlign="left"
            multiline
            style={styles.leyenda}
          />

          <TouchableOpacity
            style={styles.msjboxBtn}
            onPress={envio ? digitMSJ : undefined}
          >
            {envio ? (
              <Image
                source={require('@/assets/images/enviar.png')}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(10),
                  height: PixelRatio.getPixelSizeForLayoutSize(10),
                  borderRadius: 9999,
                }}
              />
            ) : (
            <Image
                source={require('@/assets/images/senal-de-stop.png')}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(10),
                  height: PixelRatio.getPixelSizeForLayoutSize(10),
                  borderRadius: 9999,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
);

};

export default ChatScreen;