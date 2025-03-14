import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useGlobalStyles } from "./recursos/style";
import * as SQLite from 'expo-sqlite';
import React, {useState, useEffect} from "react";

export default function Index() {
  const [DB, setDb] = useState(null)
  useEffect(()=>{
    const createTable = async () => {
      try{
      const db = await SQLite.openDatabaseAsync('sneakychat.db');
      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS CATEGORIA (
            ID_categoria INTEGER PRIMARY KEY AUTOINCREMENT, 
            Nombre TEXT(40) NOT NULL);
            
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            Titulo TEXT(40) NOT NULL, 
            Descripcion TEXT(120), 
            ID_categoria INTEGER,
            FOREIGN KEY (ID_categoria) REFERENCES CATEGORIA(ID_categoria));

            CREATE TABLE IF NOT EXISTS MENSAJE (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            Sala TEXT(20) NOT NULL, 
            Dates DATETIME DEFAULT CURRENT_TIMESTAMP, 
            Texto TEXT(120), 
            Id_User TEXT(40) NOT NULL);

            CREATE TABLE IF NOT EXISTS DATOSP (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            pass TEXT(20) NOT NULL,
            Id_User TEXT(40) NOT NULL);

            CREATE TABLE IF NOT EXISTS SALAS (
            Id_sala INTEGER(5) NOT NULL, 
            pass TEXT(20) NOT NULL, 
            nombre TEXT(20));

            CREATE TABLE IF NOT EXISTS EMISOR (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            e BIGINT,
            n TEXT(2048),
            Id_User TEXT(40) NOT NULL);`
        );
        console.log('logrado');
    } catch (error) {
        console.error('hay este error ',error);
    }
    }
  });
  return (
    <View style={useGlobalStyles().container}>
      <Text style={useGlobalStyles().text}>Pantalla de inicio.</Text>
      <Link href={"/registro_user"} style={useGlobalStyles().link}>Ir a pantalla de registro</Link>
      <Link href={"/registro_sala"} style={useGlobalStyles().link}>Ir a pantalla de registro de sala</Link>
      <Link href={"/mensajeria"} style={useGlobalStyles().link}>Ir a pantalla de mensajes</Link>
    </View>
  );
}