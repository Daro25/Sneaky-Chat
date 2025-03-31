import { useGlobalStyles, useTheme } from "./recursos/style";
import React, {useState, useEffect} from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Nota , Categoria } from "@/db/schema";
import { View, FlatList, TouchableOpacity, Text, Pressable } from "react-native";
import NotaView from "@/assets/Componentes/Nota";
import { router } from "expo-router";
import { Image } from 'expo-image';
import { eq } from "drizzle-orm";

export default function Index() {
  //base de datos mas facil con drizzle
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const [Notas, setNotas] = useState<Nota[]>([]);
  const [Categorias, setCategorias] = useState<Categoria[]>([])
  const PlaceholderImage = require('../assets/images/agregar.png')
  var openUser = false
  var openSala = false
  const [id, setId] = useState(0);
  const consulta = async ()=>{
    const result = (await drizzleDb.select().from(schema.notas)).toReversed();
    setNotas(result)
  }
  const consultaCat = async ()=>{
    const result = (await drizzleDb.select().from(schema.categoria));
    setCategorias(result);
  }
  const getColor = (id: number)=>{
    Categorias.forEach(element => {
      if (element.idCategoria === id) {
        return element.color;
      }
    });
  }
  const deleteForId = async (id: any)=> {
    await drizzleDb.delete(schema.notas).where(eq(schema.notas.id, id));
    await consulta()
  }
  const updateForId  = async (id: any) =>{
    setId(id)
    const result = (await drizzleDb.select().from(schema.notas));
    result.length > 0? ()=>{
      result.forEach(resultI => {
    if (resultI.id === id) {
      router.push({pathname: './crearNota',
        params:{
          id: resultI.id,
          titulo: resultI.titulo,
          context: resultI.descripcion,
          cate: resultI.idCategoria,
          edit: 'true',
        }});
    }
      }) }: ()=>{}
  }
  useEffect(()=>{
    const accion = async ()=>{
      openUser = (await drizzleDb.select().from(schema.datosp)).length == 0;
      openSala = (await drizzleDb.select().from(schema.salas)).length == 0;
      const result = (await drizzleDb.select().from(schema.categoria));
      if (result.length === 0){
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Nulo',
          color: '#9B7EBD'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Primordial',
          color: '#FAEDCB'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Hogar',
          color: '#9B7EBD'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Pagos',
          color: '#C9E4DE'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Escuela',
          color: '#C6DEF1'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Trabajo',
          color: '#F7D9C4'
        });
      }
    };
    accion();//insertamos datos en la tabla catalogo
    consulta();
    consultaCat();
    if (openUser) {
      openUser = false;
      router.push('./registro_user')
    } else if (openSala) {
      openSala = false;
      router.push('./registro_sala')
    }
  });
  const addNota = ()=>{
    const crearNota = async()=>{
      router.push({pathname:'./crearNota', params:{edit:''}});
      consulta();
    };
    crearNota()
  };
  return (
    <View style={useGlobalStyles().container}>
      <Text>{id}</Text>
      <FlatList style={{width:'100%', position:'relative'}} data={Notas} renderItem={({item})=>(
        <NotaView 
        title={item.titulo} 
        context={item.descripcion} 
        categoria={item.idCategoria} 
        id={item.id} 
        color={getColor(Number(item.idCategoria))}
        delete={deleteForId}
        update={updateForId}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      
      <TouchableOpacity style={[ [,{width: 'auto', display:'flex', position:'absolute', bottom:7, right: 7, padding: 10, borderRadius: '50%', alignItems: 'center',justifyContent: 'center',}]]}
        onPress={addNota}>
          <Image style={{width: 90, height: 90, borderRadius:'50%'}} source={PlaceholderImage}/>
      </TouchableOpacity>

      <View style={{backgroundColor: useTheme()? 'black': 'white', borderRadius: 10, width:'70%', height: 100, padding: 9}}>
        <Text style={[useGlobalStyles().negrita, useGlobalStyles().text]}>Categorias:</Text>
        <View style={useGlobalStyles().container_H}>
          <Pressable style={[useGlobalStyles().btn_normal, useGlobalStyles().btn_div2]}
          onPress={()=> router.push('./crearCate')}>Añadir Categoria</Pressable>
          <FlatList style={useGlobalStyles().btn_div2} data={Categorias} renderItem={({item})=>(
            <Text style={[useGlobalStyles().negrita, useGlobalStyles().text]}>{item.nombre}</Text>
          )} keyExtractor={item => item.idCategoria.toString()}/>
        </View>
      </View>
    </View>
  );
}