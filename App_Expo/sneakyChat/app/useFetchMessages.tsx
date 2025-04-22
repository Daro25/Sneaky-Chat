import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useEffect, useState } from "react";
import * as schema from "@/db/schema";
import * as SecureStore from 'expo-secure-store';
import { RSA } from 'react-native-rsa-native';
import { eq } from 'drizzle-orm';

const useFetchMessages = () => {
        const [messages, setMessages] = useState <any[]>([]);
        const [lastId, setLastId] = useState(0);
        const db = useSQLiteContext();
        const [name, setName] = useState("");
        const [sala, setSala] = useState("");
        const [salaId, setSalaId] = useState(0);
        const [emisorName, setEmisorName] = useState('');
        const [emisorId, setEmisorId] = useState(0);
        const [pausa, setPausa] =  useState(false);
        const drizzleDb = drizzle(db, { schema});
        //--------------------------------------------------------------------
        const fetchMessages = async () => {
            const newMessages: { id: number; userId: string; fecha: string; 
                hora: string; text: string; isCurrentUser: boolean; }[] = [];
            const result = await drizzleDb.select().from(schema.mensaje)
            var llavePrivada = await SecureStore.getItemAsync('llavePrivada') || '';
            if(result.length > 0) {
                setLastId(result[result.length-1].idServer);
                result.forEach(fila =>{
                    const date = new Date(fila.dates);
                    const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                    const hora = date.toLocaleTimeString();
                    newMessages.push({
                        id: fila.id, userId: fila.idUser, fecha: fecha,
                        hora: hora, text: fila.texto, 
                        isCurrentUser: fila.idUser === name,
                    });
                });
                setMessages((prevMessages) => {
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const filteredNewMessages = newMessages.filter(m => !existingIds.has(m.id));
                    return [...prevMessages, ...filteredNewMessages];
                });
             }
            try {
                if (!llavePrivada) {
                    throw new Error("Llave privada no encontrada en SecureStore");
                }else{         
                    const urlMsj = `https://ljusstudie.site/Consulta.php?sala=${salaId}&Id=${lastId}`;    
                    const response = await fetch(urlMsj);
                    if (!response.ok) {}
                    const data = await response.json();
                    for (const fila of data){
                        const texto = await RSA.decrypt(fila.Texto, llavePrivada);
                        const registrar = async()=>{
                            const busqueda = await drizzleDb.select().from(schema.mensaje).where(eq(schema.mensaje.idServer, fila.ID));
                            if (busqueda.length === 0) {
                                await drizzleDb.insert(schema.mensaje).values({
                                    sala: sala,
                                    dates: fila.FechayHora, 
                                    texto: texto, 
                                    idUser: Number(fila.User_id) === emisorId ? emisorName : name,
                                    idServer: fila.ID
                                });
                            }
                        }
                        registrar();
                    }
                }
            } catch (error) {
                setPausa(true)
            }
        };
        useEffect(() => {
            const interval = setInterval(() => {
                if (emisorName != ''&& salaId!=0 && emisorId!=0 && name != '' && !pausa) {
                    fetchMessages();
                }else{
                    const corregir = async ()=> {
                        const usuario = await drizzleDb.select().from(schema.datosp);
                        if (usuario.length >0) {
                            setName(usuario[0].idUser);
                        }
                        const emisor = await drizzleDb.select().from(schema.emisor);
                        if (emisor.length >0) {
                            setEmisorId(emisor[0].idUsserver)
                            setEmisorName(emisor[0].idUser)
                        }
                        const sala = await drizzleDb.select().from(schema.salas);
                        if (sala.length >0) {
                            setSala(sala[0].nombre)
                            setSalaId(sala[0].idSala)
                        }
                    }
                    corregir();
                }
            }, 5000);
            return () => clearInterval(interval); // Limpia el intervalo si el componente se desmonta
        }, []);
    
        return messages;
    };
export default useFetchMessages;