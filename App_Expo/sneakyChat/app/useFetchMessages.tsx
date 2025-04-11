import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { encryptMessage, decryptMessage } from "@/app/recursos/cripto";
import ObtenerLlavePrivada from "./recursos/secureStore";
import { Alert } from 'react-native';

const useFetchMessages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [lastId, setLastId] = useState(0);
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    const newMessages: { id: number; userId: number; fecha: string; 
        hora: string; text: string; isCurrentUser: boolean; }[] = [];
    //--------------------------------------------------------------------
    const fetchMessages = async () => {
        const result = await drizzleDb.select().from(schema.mensaje)
        const resultS = await drizzleDb.select().from(schema.salas)
        const user = await drizzleDb.select().from(schema.datosp)
        const consultaU = await fetch(`https://ljusstudie.site/Consulta_Usuario.php?nombre=${encodeURIComponent(user[0].idUser)}&pass=${encodeURIComponent(user[0].pass)}`);
            if (!consultaU.ok) { Alert.alert(`HTTP error! statusU1: ${consultaU.status}`);}
            const dataU = await consultaU.json();
        const llavePrivada = await ObtenerLlavePrivada();
        result.length > 0 ? ()=>{
            setLastId(result[result.length-1].id)
            result.forEach(fila =>{
                const date = new Date(fila.dates);
                const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                const hora = date.toLocaleTimeString();
                newMessages.push({
                    id: fila.id, userId: parseInt(fila.idUser), fecha: fecha,
                    hora: hora, text: fila.texto, 
                    isCurrentUser: Number(fila.idUser) === Number(dataU[0].Id_User),
                });
            });
            setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
         } : ()=>{}
        try {
            const consulta = await fetch(`https://ljusstudie.site/Consulta_Sala.php?nombre=${encodeURIComponent(resultS[0].nombre)}&pass=${encodeURIComponent(resultS[0].pass)}`);
            if (!consulta.ok) { Alert.alert(`HTTP error! status1: ${consulta.status}`);}
            const dataC = await consulta.json();
            const response = await fetch(`https://ljusstudie.site/Consulta.php?sala=${dataC.ID_Sala}&Id=${lastId}`);
            if (!response.ok) {Alert.alert(`HTTP error! status2: ${response.status}`);}
            const data = await response.json();

            let newLastId = lastId;

            data.forEach((fila: {
                ID: number; User_id: number; FechayHora: string; Texto: string; sala_Id:number;
}) => {
                const date = new Date(fila.FechayHora);
                const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                const hora = date.toLocaleTimeString(); // Convierte a formato de hora local

                newMessages.push({
                    id: fila.ID, userId: fila.User_id, fecha: fecha,
                    hora: hora, text: decryptMessage(fila.Texto, llavePrivada+'')+'', 
                    isCurrentUser: Number(fila.User_id) === Number(dataU[0].Id_User),
                });
                const registrar = async()=>{
                    await drizzleDb.insert(schema.mensaje).values({
                        sala: fila.sala_Id+'',
                        dates: fila.FechayHora, 
                        texto: decryptMessage(fila.Texto, llavePrivada+'')+'', 
                        idUser: fila.User_id+'',
                        idServer: fila.ID
                    });
                }
                registrar();
                newLastId = fila.ID;
            });

            setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
            setLastId(newLastId);
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
        }
    };
    useEffect(() => {
        const interval = setInterval(fetchMessages, 1000);
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [lastId]);

    return messages;
};
export default useFetchMessages;
