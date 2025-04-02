import { router } from "expo-router";
import { Pressable, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, PixelRatio } from 'react-native';
import React, { useState } from "react";
import { useGlobalStyles } from "@/app/recursos/style";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ModalCreacion2() {
  const [nombre, setName] = useState(''); // Inicializado como string vacío
  const [visible, setVisible] = useState(false);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [msjButton, setMsjButton] = useState('Crear Categoría');

  const insert = async () => {
    try {
      await drizzleDb.insert(schema.categoria).values({
        nombre: nombre,
        color: '#C6DEF1',
      });
      router.dismissAll();
    } catch (error) {
      console.error('Error al insertar categoría:', error);
      setMsjButton('Error al crear categoría.');
    }
  };

  const handleCreate = () => {
    if (!nombre.trim()) {
      setMsjButton('Cancelando acción...');
      setTimeout(() => router.dismissAll(), 2000);
    } else {
      if (!visible) {
        setMsjButton('Confirmas esta acción, no hay retorno.')
        setVisible(!visible);
      } else {
        insert();
      }
    }
  };

  return (
    <Animated.View entering={FadeIn} style={styles.modalContainer}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.dismissAll()} />
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[useGlobalStyles().negrita, styles.input]}
            placeholder="Digita el nombre de la categoría."
            placeholderTextColor={'#a9a9a9'}
            onChangeText={setName}
            maxLength={40}
            value={nombre}
          />
          <Text style={styles.charCount}>{nombre.length} / 40.</Text>
          <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
            <Text style={[useGlobalStyles().negrita, { color: 'black' }]}>{msjButton}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A8',
  },
  modalContent: {
    borderRadius: 10,
    width: '90%',
    maxWidth: PixelRatio.getPixelSizeForLayoutSize(450),
    minHeight: 120,
    position: 'relative',
    backgroundColor: '#FAEDCB',
    overflow: 'hidden',
  },
  inputContainer: {
    borderRadius: 10,
    padding: 10,
    paddingVertical: 40,
    backgroundColor: '#FAEDCB',
    width: '100%',
    maxWidth: PixelRatio.getPixelSizeForLayoutSize(450),
    minHeight: 200,
    position: 'relative',
  },
  input: {
    minHeight: 40,
    margin: 12,
    width: '100%',
    borderWidth: 0,
    padding: 10,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#a9a9a9',
  },
  createButton: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
});