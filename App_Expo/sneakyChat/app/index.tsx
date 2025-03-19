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
  const consulta =async ()=>{
    const result = await drizzleDb.select().from(schema.notas);
    setNotas(result)
  }
  useEffect(()=>{
    consulta()
  });
  const addNota = ()=>{
    const crearNota = async()=>{
      const result = await drizzleDb.insert(schema.notas).values({
        titulo: '',
        descripcion: '',
        idCategoria: 1
      });
      consulta;
      crearNota();
    };
  };
  return (
    <View style={useGlobalStyles().container}>
      <FlatList data={Notas} renderItem={({item})=>(
        <NotaView title={item.titulo} context={item.descripcion}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      <TouchableOpacity style={[useGlobalStyles().btn_normal, [,{width: 'auto', display:'flex', position:'absolute', bottom:7, right: 7}]]}
        onPress={addNota}>
          <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Añadir Nota</Text>
      </TouchableOpacity>
    </View>
  );
}