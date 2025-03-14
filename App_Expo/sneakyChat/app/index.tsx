import { Button, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useGlobalStyles } from "./recursos/style";
import * as SQLite from 'expo-sqlite';
import React, {useState, useEffect} from "react";

export default function Index() {
  const [alertaVisible, setAlertaVisible]= useState(false)
  const [mensaje, setMensaje] = useState('no hay ningun mensaje');
  useEffect(()=>{
    const createTable = async () => {
      try{
      const db = await SQLite.openDatabaseAsync('sneakychat.db');
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS CATEGORIA (
            ID_categoria INTEGER PRIMARY KEY AUTOINCREMENT, 
            Nombre TEXT(40) NOT NULL);`);
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS MENSAJE (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            Titulo TEXT(40) NOT NULL, 
            Descripcion TEXT(120), 
            ID_categoria INTEGER,
            FOREIGN KEY (ID_categoria) REFERENCES CATEGORIA(ID_categoria));`);
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS MENSAJE (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            Sala TEXT(20) NOT NULL, 
            Dates DATETIME DEFAULT CURRENT_TIMESTAMP, 
            Texto TEXT(120), 
            Id_User TEXT(40) NOT NULL);`);
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS DATOSP (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            pass TEXT(20) NOT NULL,
            Id_User TEXT(40) NOT NULL);`);
      await db.execAsync(
            `CREATE TABLE IF NOT EXISTS SALAS (
            Id_sala INTEGER(5) NOT NULL, 
            pass TEXT(20) NOT NULL, 
            nombre TEXT(20));`);
      await db.execAsync(
            `CREATE TABLE IF NOT EXISTS EMISOR (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            e BIGINT,
            n TEXT(2048),
            Id_User TEXT(40) NOT NULL);`);
        setMensaje('logrado');
    } catch (error) {
        setMensaje('hay este error '+error);
    }
    setAlertaVisible(true)
    }
  });
  return (
    <View style={useGlobalStyles().container}>
      {
        alertaVisible&&(
          <>
            <Text style={useGlobalStyles().text}>{mensaje}</Text>
            <TouchableOpacity style={[useGlobalStyles().btn_normal, useGlobalStyles().center, [,{width:'100%', minHeight:70}]]}
            onPress={()=>{setAlertaVisible(false)}}>
              <Text style={[useGlobalStyles().text, useGlobalStyles().negrita, useGlobalStyles().center]}>Unirse</Text>
            </TouchableOpacity>
          </>
        )
      }
      <Text style={useGlobalStyles().text}>Pantalla de inicio.</Text>
      <Link href={"/registro_user"} style={useGlobalStyles().link}>Ir a pantalla de registro</Link>
      <Link href={"/registro_sala"} style={useGlobalStyles().link}>Ir a pantalla de registro de sala</Link>
      <Link href={"/mensajeria"} style={useGlobalStyles().link}>Ir a pantalla de mensajes</Link>
    </View>
  );
}