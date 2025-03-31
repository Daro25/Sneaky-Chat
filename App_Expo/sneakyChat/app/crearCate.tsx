import { router } from "expo-router";
import { Pressable, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, PixelRatio } from 'react-native';
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "@/app/recursos/style";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ModalCreacion() {
  const [nombre, setName] = useState(''); // Inicializado como string vacío
  const [visible, setVisible] = useState(false)
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [limitChar, setLimitChar] = useState(0);
  const [msjButton, setMsjButton] = useState('Crear Categoria')
  useEffect(() => setLimitChar(nombre.length), [nombre]);

  const insert = async () => {
    await drizzleDb.insert(schema.categoria).values({
        nombre: nombre,
        color: '#C6DEF1',
      });
    router.replace('/');
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={styles.modalContainer}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.replace('/')} />
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[useGlobalStyles().negrita, styles.input]}
            placeholder="Digita el nombre de la categoria."
            placeholderTextColor={'#a9a9a9'}
            onChangeText={setName}
            maxLength={40}
            value={nombre}
          />
          <Text style={styles.charCount}>{limitChar} / 40.</Text>
          <TouchableOpacity
            onPress={() => {
              if (nombre === null || nombre === undefined || nombre.trim() === "") {
                setMsjButton('Cancelando acción...')
                setTimeout(() => router.replace('/'), 2000);
              } else {
                setVisible(true)
              }
            }}
            style={styles.createButton}>
            <Text style={[useGlobalStyles().negrita, { color: 'white' }]}>{msjButton}</Text>
          </TouchableOpacity>{ visible && (<>
            <Text>¿Estas seguro de crear esta, categoria?</Text>
          <TouchableOpacity
            onPress={() => {
              if (nombre === null || nombre === undefined || nombre.trim() === "") {
                setMsjButton('Cancelando acción...')
                setTimeout(() => router.replace('/'), 2000);
              } else {
                insert();
              }
            }}
            style={styles.createButton}>
            <Text style={[useGlobalStyles().negrita, { color: 'white' }]}>Confirmo</Text>
          </TouchableOpacity></>)}
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
    height: 'auto',
    minHeight: 120,
    position: 'relative',
    backgroundColor: '#FAEDCB',
    overflowX: 'hidden',
  },
  categorySelector: {
    position: 'absolute',
    width: 'auto',
    minWidth: 90,
    height: 'auto',
    top: 5,
    zIndex: 1,
    right: 5,
  },
  categoryList: {
    position: 'absolute',
    left: 0,
    marginLeft: '25%',
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#441752',

    color:'white',
    zIndex: 2,
  },
  categoryButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 'auto',
    minWidth: 90,
    height: 'auto',
    borderBlockColor: 'white',
    borderWidth: 1
  },
  categoryImage: {
    width: 25,
    height: 25,
  },
  inputContainer: {
    borderRadius: 10,
    padding: 10,
    paddingVertical: 40,
    backgroundColor: '#FAEDCB',
    width: '100%',
    maxWidth: PixelRatio.getPixelSizeForLayoutSize(450),
    height: 'auto',
    minHeight: 200,
    position: 'relative',
  },
  input: {
    minHeight: 40,
    height: 'auto',
    margin: 12,
    width: '100%',
    borderWidth: 0,
    padding: 10,
    position: 'relative',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#a9a9a9',
  },
  createButton: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    position: "relative",
    bottom: 0,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
});