import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import useFetchMessages from './useFetchMessages';

const ChatScreen = () => {
    const userId = "Juan"; // Simulación del ID del usuario actual
    const messages = useFetchMessages(userId);

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.isCurrentUser ? styles.sent : styles.received]}>
                        <Text>{item.userId}</Text>
                        <Text>{item.timestamp}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    message: { padding: 10, marginVertical: 5, borderRadius: 5 },
    sent: { backgroundColor: '#cceeff', alignSelf: 'flex-end' },
    received: { backgroundColor: '#ffe0b2', alignSelf: 'flex-start' },
});

export default ChatScreen;