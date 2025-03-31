import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, PixelRatio } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "@/app/recursos/style";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Src} from "./recursos/categorias";
import { Categoria } from "@/db/schema";
import Animated, { FadeIn } from 'react-native-reanimated';
import { eq } from "drizzle-orm";

export default function ModalCreacion() {
  const [categoria, setCategoria] = useState(1);
  const [nombre, setName] = useState(''); // Inicializado como string vacío
  const [texto, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const PlaceholderImage = Src(categoria);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [limitChar, setLimitChar] = useState(0);
  const { edit='', id = 0, cate = 0, titulo = '', context = ''} = useLocalSearchParams();
  const [editin, setEditin] = useState(false);
  const [ID, setId] = useState(0);
  const [msjButton, setMsjButton] = useState('Crear Nota')
  const [Categorias, setCategorias] = useState<Categoria[]>([])
  const consultaCat = async ()=>{
      const result = (await drizzleDb.select().from(schema.categoria));
      setCategorias(result);
    }
    useEffect(()=>{consultaCat()});
  try {
    if(edit === 'true') {
      setId(Number(id));
      setCategoria(Number(cate));
      setName(titulo+'');
      setText(context+'');
      setEditin(true);
      setMsjButton('Confirmar Edición de nota');
    }
  } catch (error) {}
  useEffect(() => setLimitChar(texto.length), [texto]);

  const insert = async () => {
    if (!editin) {
      await drizzleDb.insert(schema.notas).values({
        idCategoria: categoria,
        titulo: nombre,
        descripcion: texto,
      });
    } else {
      await drizzleDb.update(schema.notas).set({
        idCategoria: categoria,
        titulo: nombre,
        descripcion: texto,
      }).where(eq(schema.notas.id, ID));
    }
    router.replace('/');
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={styles.modalContainer}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.replace('/')} />
      <SafeAreaView style={[styles.modalContent, { backgroundColor: Categorias[categoria].color }]}>
        <View style={styles.categorySelector}>
          {visible && (
            <FlatList
              style={styles.categoryList}
              data={Categorias}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setVisible(false);
                  setCategoria(item.idCategoria);
                }}>
                  <Text style={{color:'white'}}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.idCategoria.toString()}
            />
          )}
          <TouchableOpacity style={styles.categoryButton} onPress={() => setVisible(true)}>
            <Text style={useGlobalStyles().inlineBlock}>Selecciona categoria: {Categorias[categoria - 1].nombre}</Text>
            <Image style={[useGlobalStyles().inlineBlock, styles.categoryImage]} source={PlaceholderImage} />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputContainer, { backgroundColor: Categorias[categoria].color }]}>
          <TextInput
            style={[useGlobalStyles().negrita, styles.input]}
            placeholder="Digita el nombre de la nota."
            placeholderTextColor={'#a9a9a9'}
            onChangeText={setName}
            maxLength={40}
            value={nombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Digita una descripción detallada (opcional)"
            placeholderTextColor={'#a9a9a9'}
            numberOfLines={7}
            onChangeText={setText}
            textAlignVertical="top"
            textAlign="left"
            multiline={true}
            maxLength={250}
            value={texto}
          />
          <Text style={styles.charCount}>{limitChar} / 250.</Text>
          <TouchableOpacity
            onPress={() => {
              if (nombre === null || nombre === undefined || nombre.trim() === "") {
                if (texto === null || texto === undefined || texto.trim() === '') {
                  setMsjButton('Cancelando acción...')
                  setTimeout(() => router.replace('/'), 2000);
                } else {
                  texto.length > 20? setName(texto.substring(0,19)+'...'): setName(texto);
                  insert();
                }
              } else {
                insert();
              }
            }}
            style={styles.createButton}
          >
            <Text style={[useGlobalStyles().negrita, { color: 'white' }]}>{msjButton}</Text>
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
    height: 'auto',
    minHeight: 200,
    position: 'relative',
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
  errorView: {
    width: '100%',
    height: 'auto',
    zIndex: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
});