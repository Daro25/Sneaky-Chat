import { useState, useEffect } from 'react';

const useFetchMessages = (userId) => {
    const [messages, setMessages] = useState([]);
    const [lastId, setLastId] = useState(0);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`https://tu-servidor.com/Consultar.php?sala=1&Id=${lastId}`);
            const data = await response.json();

            let newMessages = [];
            let newLastId = lastId;

            data.forEach(fila => {
                newMessages.push({
                    id: fila.Id,
                    userId: fila.User_id,
                    timestamp: fila.FechayHora,
                    text: fila.Texto,
                    isCurrentUser: fila.User_id === userId,
                });
                newLastId = fila.Id;
            });

            setMessages(prevMessages => [...prevMessages, ...newMessages]);
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
