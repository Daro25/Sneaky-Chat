import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { encryptMessage, decryptMessage } from "@/app/recursos/cripto";
import ObtenerLlavePrivada from "./recursos/secureStore";

const useFetchMessages = (userId: number) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [lastId, setLastId] = useState(0);
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    const newMessages: { id: number; userId: number; fecha: string; 
        hora: string; text: string; isCurrentUser: boolean; }[] = [];
    //--------------------------------------------------------------------
    const fetchMessages = async () => {
        const result = await drizzleDb.select().from(schema.mensaje)
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
                    isCurrentUser: Number(fila.idUser) === userId,
                });
            });
            setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
         } : ()=>{}
        try {
            const response = await fetch(`http://134.209.211.47/Consulta.php?sala=1000&Id=${lastId}`);
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
                    isCurrentUser: Number(fila.User_id) === userId,
                });
                const registrar = async()=>{
                    await drizzleDb.insert(schema.mensaje).values({
                        sala: fila.sala_Id+'',
                        dates: fila.FechayHora, 
                        texto: decryptMessage(fila.Texto, llavePrivada+'')+'', 
                        idUser: fila.User_id+''
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
