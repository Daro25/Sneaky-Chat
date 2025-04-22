import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import * as SecureStore from 'expo-secure-store';
import RNRsaNative, { RSA } from 'react-native-rsa-native';

const useFetchMessages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [errors, setError] = useState('');
    const [lastId, setLastId] = useState(0);
    const [keyPublic, setKey] = useState('');
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    const newMessages: { id: number; userId: number; fecha: string; 
        hora: string; text: string; isCurrentUser: boolean; }[] = [];
    //--------------------------------------------------------------------
    const fetchMessages = async () => {
        const result = await drizzleDb.select().from(schema.mensaje)
        const resultS = await drizzleDb.select().from(schema.salas)
        const user = await drizzleDb.select().from(schema.datosp)
        const emisors = await drizzleDb.select().from(schema.emisor)
        const [Id_User, setId_User] = useState('');
        function hadleError(s: string) {
            setError(s);
        }
        if (emisors.length === 0){
            const urlUss = `https://ljusstudie.site/ConsultaUsuarioWsala.php?id_sala=${resultS[0].idSala}`;
            const consultaU = await fetch(urlUss);
            if (!consultaU.ok) { hadleError(`HTTP error! statusU1: ${consultaU.status}`);
            } else {
                const dataU = await consultaU.json();
                for (let i = 0; i < dataU.length; i++) {
                    const element = dataU[i];
                    if (element.Id_User != user[0].Id_Usserver) {
                        setId_User(element.Nomb);
                        setKey(element.KeyPublic);
                        await drizzleDb.insert(schema.emisor).values({
                            idUsserver: Number(element.Id_User),
                            n: element.KeyPublic,
                            idUser: element.Nomb
                        });
                        break;
                    }
                }
            }
        } else {
            setId_User(emisors[0].idUser);
            setKey(emisors[0].n);
        }
        var llavePrivada = await SecureStore.getItemAsync('llavePrivada') || '';
        result.length > 0 ? ()=>{
            setLastId(result[result.length-1].id)
            result.forEach(fila =>{
                const date = new Date(fila.dates);
                const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                const hora = date.toLocaleTimeString();
                newMessages.push({
                    id: fila.id, userId: parseInt(fila.idUser), fecha: fecha,
                    hora: hora, text: fila.texto, 
                    isCurrentUser: fila.idUser === Id_User,
                });
            });
            setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
         } : ()=>{}
        try {
            const response = await fetch(`https://ljusstudie.site/Consulta.php?sala=${resultS[0].idSala}&Id=${lastId}`);
            if (!response.ok) {hadleError(`HTTP error! status2: ${response.status}`);}
            const data = await response.json();

            let newLastId = lastId;
            await data.forEach(async (fila: {
                ID: number; User_id: number; FechayHora: string; Texto: string; sala_Id:number;
}) => {
                const date = new Date(fila.FechayHora);
                const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                const hora = date.toLocaleTimeString(); // Convierte a formato de hora local
                const texto = await RSA.decrypt(fila.Texto, llavePrivada);

                newMessages.push({
                    id: fila.ID, userId: fila.User_id, fecha: fecha,
                    hora: hora, text: texto, 
                    isCurrentUser: Number(fila.User_id) === Number(user[0].Id_Usserver),
                });
                const registrar = async()=>{
                    await drizzleDb.insert(schema.mensaje).values({
                        sala: resultS[0].nombre,
                        dates: fila.FechayHora, 
                        texto: texto, 
                        idUser: Number(fila.User_id) === user[0].Id_Usserver ? user[0].idUser : Id_User,
                        idServer: fila.ID
                    });
                }
                registrar();
                newLastId = fila.ID;
            });

            setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
            setLastId(newLastId);
        } catch (error) {
            hadleError('Error al obtener mensajes:'+ error);
        }
    };
    useEffect(() => {
        const interval = setInterval(fetchMessages, 1000);
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [lastId]);

    return {
        messages: messages,
        error: errors
    };
};
export default useFetchMessages;
