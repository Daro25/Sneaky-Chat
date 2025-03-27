import { useGlobalStyles } from "./recursos/style";
import React, {useState, useEffect} from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Nota } from "@/db/schema";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import NotaView from "@/assets/Componentes/Nota";
import { router } from "expo-router";
import { Image } from 'expo-image';
import { eq } from "drizzle-orm";

export default function Index() {
  //base de datos mas facil con drizzle
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const [Notas, setNotas] = useState<Nota[]>([]);
  const PlaceholderImage = require('../assets/images/agregar.png')
  var openUser = false
  var openSala = false
  const [msj, setMsj] = useState('')
  const consulta = async ()=>{
    const result = (await drizzleDb.select().from(schema.notas)).toReversed();
    setNotas(result)
  }
  const deleteForId = async (id: any)=> {
    await drizzleDb.delete(schema.notas).where(eq(schema.notas.id, id));
    setMsj(id)
    await consulta()
  }
  useEffect(()=>{
    const accion = async ()=>{
      openUser = (await drizzleDb.select().from(schema.datosp)).length == 0;
      openSala = (await drizzleDb.select().from(schema.salas)).length == 0;
      const result = (await drizzleDb.select().from(schema.categoria)).length;
      if (result == 0){
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Nulo'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Primordial'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Hogar'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Pagos'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Escuela'
        });
        await drizzleDb.insert(schema.categoria).values({
          nombre: 'Trabajo'
        });
      }
    };
    accion();//insertamos datos en la tabla catalogo
    consulta();
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
      router.push('./crearNota');
      consulta();
    };
    crearNota()
  };
  return (
    <View style={useGlobalStyles().container}>
      <Text style={useGlobalStyles().text}>{msj}</Text>
      <FlatList style={{width:'100%', position:'relative'}} data={Notas} renderItem={({item})=>(
        <NotaView title={item.titulo} context={item.descripcion} categoria={item.idCategoria} id={item.id} delete={deleteForId}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      <TouchableOpacity style={[ [,{width: 'auto', display:'flex', position:'absolute', bottom:7, right: 7, padding: 10, borderRadius: '50%', alignItems: 'center',justifyContent: 'center',}]]}
        onPress={addNota}>
          <Image style={{width: 90, height: 90, borderRadius:'50%'}} source={PlaceholderImage}/>
      </TouchableOpacity>
    </View>
  );
}