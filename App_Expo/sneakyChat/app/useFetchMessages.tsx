import { useState } from "react";

const useFetchMessages = (userId: number, lastId: number, name: string, emisorName: string, sala_Id: number) => {
    
    const [messages, setMessages] = useState<{ idS: number; name: string; date: string; text: string}[]>([]);
    let newMessages: { idS: number; name: string; date: string; text: string}[] = [];
    const fetchMessages = async () => {
        const url = `https://ljusstudie.site/Consulta.php?sala=${sala_Id}&Id=${lastId}`;
        const response = await fetch(url);
        const data = await response.json();
        let newLastId = lastId;
        data.forEach((fila: {ID: number; User_id: number; FechayHora: string; Texto: string; }) => {
            newMessages.push({
                idS: fila.ID,
                name: fila.User_id === userId? name : emisorName,
                date: fila.FechayHora,
                text: fila.Texto,
            });
                newLastId = fila.ID;
        });
        setMessages((prevMessages: any[]) => [...prevMessages, ...newMessages]);
    };
    fetchMessages();
    return messages;
};

export default useFetchMessages;
