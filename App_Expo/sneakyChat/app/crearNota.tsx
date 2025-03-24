import { Link, router } from "expo-router";
import { FlatList, Pressable, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, PixelRatio } from 'react-native';
import { Image } from 'expo-image';
import React, {useState} from "react";
import { colorText, useGlobalStyles } from "@/app/recursos/style";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Categorias, { Src , Bgcolor } from "./recursos/categorias";
import Animated, {
  FadeIn,
} from 'react-native-reanimated';

export default function ModalCreacion() {
    const [categoria, setCategoria] = useState(1);
    const [nombre, setName] = useState('Nombre de la nota.')
    const [texto, setText] = useState('')
    const [visible, setVisible] = useState (false)
    const PlaceholderImage = Src(categoria);
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema});
    return(
    <Animated.View
    entering={FadeIn}
    style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000A8',
    }}>
        {/* Este codigo es para salir cuando presionas en la parte exterior de la pagina */}
        <Link href={'/'} asChild>
            <Pressable style={StyleSheet.absoluteFill} />
        </Link>
        <SafeAreaView style={{
                borderRadius: 10,
                width: '90%',
                maxWidth: PixelRatio.getPixelSizeForLayoutSize(450),
                height: 'auto',
                minHeight: 200,
                position: 'relative',
                overflowX: 'hidden',
                backgroundColor: Bgcolor(categoria) }}>
            <View style={[[,{
                        position: 'absolute',
                        width: 'auto',
                        minWidth: 90,
                        height: 'auto',
                        top: 5,
                        zIndex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        right: 5}]]}>
                        { visible && (
                    <FlatList style={{width:50, position:'relative',borderRadius:10, backgroundColor:'white', zIndex: 2}} data={Categorias} renderItem={({item})=>(
                        <TouchableOpacity onPress={()=>{
                                    setVisible(false);
                                    setCategoria(item.id)
                                }}>
                            <Text>{item.nombre}</Text>
                        </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id.toString()}/>)}
                        <TouchableOpacity
                            onPress={()=>setVisible(true)}
                            style={[useGlobalStyles().inlineBlock]}>
                                <Text>Selecciona categoria: {Categorias[categoria-1].nombre}</Text>
                        </TouchableOpacity>
                        <Image style={[useGlobalStyles().inlineBlock, [,{ width: 25, height: 25,}]]} source={PlaceholderImage}/>
            </View>
            <View style={{
                borderRadius: 10,
                padding: 10,
                paddingVertical: 40,
                width: '100%',
                maxWidth: PixelRatio.getPixelSizeForLayoutSize(450),
                height: 'auto',
                minHeight: 200,
                position: 'relative',
                backgroundColor: Bgcolor(categoria) }}>

            <TextInput style={[useGlobalStyles().negrita, styles.input]}
                    placeholder="Digita el nombre de la nota."
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={setName}
                    maxLength={40}
                    value={nombre}/>

            <TextInput style={[styles.input]}
                    placeholder="Digita una descripción detallada (opcional)"
                    placeholderTextColor={'#a9a9a9'}
                    numberOfLines={7}
                    onChangeText={setText}
                    textAlignVertical="top"
                    textAlign="left"
                    multiline={true}
                    maxLength={250}
                    value={texto}/>

            <TouchableOpacity onPress={()=>{
                        const crearNota = async() =>{
                            await drizzleDb.insert(schema.notas).values({
                                idCategoria: categoria,
                                titulo: nombre,
                                descripcion: texto
                            });
                        }
                        crearNota();
                        router.replace('/')
                    }}
                    style={{width:'100%', position: "absolute", bottom: 0, borderWidth: 0, borderBottomWidth: 1, borderLeftWidth: 2 , borderColor: 'black', borderRadius:10, padding: 10,}}>
                        <Text style={[useGlobalStyles().negrita,[{color: 'white'}]]}>Crear Nota</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    </Animated.View>
    );
}
const styles = StyleSheet.create({
    input: {
      minHeight: 40,
      height: 'auto',
      margin: 12,
      width: '100%',
      borderWidth: 0,
      padding: 10,
      position: 'relative'
    },
  });