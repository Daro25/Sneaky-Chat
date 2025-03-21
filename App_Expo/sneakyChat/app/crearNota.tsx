import { Link, router } from "expo-router";
import { FlatList, Pressable, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import React, {useState} from "react";
import { useGlobalStyles } from "@/app/recursos/style";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import Categorias, { Src , Bgcolor } from "./recursos/categorias";
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';

export default function ModalCreacion() {
    const [categoria, setCategoria] = useState(1);
    const [nombre, setName] = useState('Nota sin nombre.')
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
        backgroundColor: '#00000040',
      }}
    >
      {/* Descarta el modal al presionar fuera */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View
        entering={SlideInDown}
        style={{
            borderRadius: 10,
            padding: 10,
            width: '90%',
            height: 'auto',
            minHeight: 120,
            marginHorizontal: '5%',
            marginVertical: 10,
            backgroundColor: Bgcolor(categoria)
        }}>
            <SafeAreaView style={{
            }}>
                <View style={[[,{
                    position: 'absolute',
                    top: 5,
                    right: 5}], useGlobalStyles().container_H]}>
                    { visible && (
                    <FlatList style={{width:50, position:'relative', backgroundColor:'white', zIndex: 2}} data={Categorias} renderItem={({item})=>(
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
                    <Image style={[useGlobalStyles().inlineBlock, [,{ width: 9, height: 9,}]]} source={PlaceholderImage}/>
                </View>

                <TextInput style={[useGlobalStyles().text, useGlobalStyles().negrita]}
                placeholder="Digita el nombre de la nota."
                placeholderTextColor={'#a9a9a9'}
                onChangeText={setName}
                maxLength={40}
                value="Nombre de la nota"/>

                <TextInput style={[useGlobalStyles().text]}
                placeholder="Digita una descripción detallada (opcional)"
                placeholderTextColor={'#a9a9a9'}
                onChangeText={setText}
                multiline={true}
                maxLength={250}
                value=""/>
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
                style={[useGlobalStyles().btn_normal, [,{width:'100%', position: "absolute", bottom: 0, borderRadius:10}]]}>
                    <Text style={[useGlobalStyles().negrita,[{color: 'white'}]]}>Crear Nota</Text>
                </TouchableOpacity>
            </SafeAreaView>
      </Animated.View>
    </Animated.View>
    );
}
function src(i:Number): string{
    switch (i) {
        case 1: return '@/assets/images/punto.png'
        case 2: return '@/assets/images/corona.png'
        case 3: return '@/assets/images/casa.png'
        case 4: return '@/assets/images/moneda.png'
        case 5: return '@/assets/images/escuela.png'
        case 6: return '@/assets/images/chamba.png'
        default: return '@/assets/images/punto.png'
    }
}
function bgcolor(i:Number) : string{
    switch (i) {
        case 1: return '#9B7EBD'
        case 2: return '#FAEDCB'
        case 3: return '#9B7EBD'
        case 4: return '#C9E4DE'
        case 5: return '#C6DEF1'
        case 6: return '#F7D9C4'
        default: return '#9B7EBD'
    }
}