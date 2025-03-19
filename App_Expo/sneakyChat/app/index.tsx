import { useGlobalStyles } from "./recursos/style";
import React, {useState, useEffect} from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Nota } from "@/db/schema";
import { View, FlatList } from "react-native";
import NotaView from "../assets/Componentes/Nota";

export default function Index() {
  //base de datos mas facil con drizzle
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const [Notas, setNotas] = useState<Nota[]>([]);

  useEffect(()=>{
    const consulta =async ()=>{
      const result = await drizzleDb.select().from(schema.notas);
      setNotas(result)
    }
    consulta()
  });
  return (
    <View style={useGlobalStyles().container}>
      <FlatList data={Notas} renderItem={({item})=>(
        <NotaView title={item.titulo} context={item.descripcion}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      
    </View>
  );
}