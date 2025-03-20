import { useGlobalStyles } from "./recursos/style";
import React, {useState, useEffect} from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Nota } from "@/db/schema";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import NotaView from "../assets/Componentes/Nota";

export default function Index() {
  //base de datos mas facil con drizzle
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const [Notas, setNotas] = useState<Nota[]>([]);
  const consulta = async ()=>{
    const result = await drizzleDb.select().from(schema.notas);
    setNotas(result)
  }
  useEffect(()=>{
    const tablaCatalogo = async ()=>{
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
    tablaCatalogo();//insertamos datos en la tabla catalogo
    consulta()
  });
  const addNota = ()=>{
    const crearNota = async()=>{
      const result = await drizzleDb.insert(schema.notas).values({
        titulo: 'bhkhv',
        descripcion: 'kvkhvk',
        idCategoria: 1
      });
      result ? consulta() : ()=>{};
    };
    crearNota()
  };
  return (
    <View style={useGlobalStyles().container}>
      <FlatList style={{width:'100%', position:'relative'}} data={Notas} renderItem={({item})=>(
        <NotaView title={item.titulo} context={item.descripcion} categoria={item.idCategoria}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      <TouchableOpacity style={[useGlobalStyles().btn_normal, [,{width: 'auto', display:'flex', position:'absolute', bottom:7, right: 7}]]}
        onPress={addNota}>
          <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Añadir Nota</Text>
      </TouchableOpacity>
    </View>
  );
}