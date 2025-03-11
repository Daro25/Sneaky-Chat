import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList } from 'react-native';
import useFetchMessages from './useFetchMessages';
import  { MensajeLeft, MensajeRight } from '../assets/Componentes/mensaje'
import { globalStyles } from "./recursos/style";

const ChatScreen = () => {
    const userId = 1000; // Simulación del ID del usuario actual
    const messages = useFetchMessages(userId); // Llamada al hook personalizado para obtener los mensajes
    const flatListRef = useRef<FlatList>(null); // Referencia a FlatList para controlar el desplazamiento

    // useEffect para desplazar automáticamente la lista al final cuando se añaden nuevos mensajes
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]); // Dependencia en messages para ejecutar el efecto cuando cambian los mensajes

    return (
        <View style={globalStyles.container}>
            <FlatList
                ref={flatListRef} // Asigna la referencia a FlatList
                data={messages} // Datos de los mensajes obtenidos
                keyExtractor={(item) => item.id.toString()} // Clave única para cada mensaje
                renderItem={({ item }) => (
                    item.isCurrentUser ? 
                    <MensajeRight 
                    user= {item.userId}
                    fecha= {item.fecha}
                    context= {item.text}
                    hora= {item.hora}/> 
                    : 
                    <MensajeLeft
                    user= {item.userId}
                    fecha= {item.timestamp}
                    context= {item.text}
                    hora= {item.hora}/> 
                )}
            />
        </View>
    );
};

export default ChatScreen;