import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const useFetchMessages = (userId: number) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [lastId, setLastId] = useState(0);
    var db: SQLite.SQLiteDatabase;
      useEffect(() => {
        const conexion = async () => {
          try {
            db = await SQLite.openDatabaseAsync('sneakychat.db');
            let resultado = await db.getFirstAsync(`SELECT * FROM MENSAJE ORDER BY ID DESC LIMIT 1;`);
            resultado? setLastId(Number(resultado)): setLastId(0)
          } catch (error) {
          }
        };
        conexion();
      }, []);
      const registro = async (ID: number,Sala: number,Dates: string,Texto: string,Id_User: number)=>{
        await db.execAsync(`INSERT INTO MENSAJE(ID,Sala,Dates,Texto,Id_User) VALUES(`
            +ID+`,`+Sala+`,`+Dates+`,`
            +Texto+`,`+Id_User+`);`);
      }
    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://134.209.211.47/Consulta.php?sala=1000&Id=${lastId}`);
            const data = await response.json();

            let newMessages: { id: number; userId: number; fecha: string; 
                hora: string; text: string; isCurrentUser: boolean; }[] = [];
            let newLastId = lastId;

            data.forEach((fila: {
                ID: number; User_id: number; FechayHora: string; Texto: string; sala_Id:number;
}) => {
                const date = new Date(fila.FechayHora);
                const fecha = date.toLocaleDateString(); // Convierte a formato de fecha local
                const hora = date.toLocaleTimeString(); // Convierte a formato de hora local

                newMessages.push({
                    id: fila.ID, userId: fila.User_id, fecha: fecha,
                    hora: hora, text: fila.Texto, 
                    isCurrentUser: Number(fila.User_id) === userId,
                });
                newLastId = fila.ID;
                registro(
                    fila.ID, fila.sala_Id, fila.FechayHora,
                    fila.Texto, fila.User_id
                );
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