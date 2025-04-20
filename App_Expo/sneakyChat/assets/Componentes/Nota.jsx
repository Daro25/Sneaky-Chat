import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGlobalStyles, useTheme } from "@/app/recursos/style";
import { Src, basura } from "@/app/recursos/categorias";
import { Image } from "expo-image";

export default function NotaView({ id = 1, categoria= 1, color = '#FFFFFF', title = 'Sin título', context = '', deleteFn = (id)=>{}, update= (id)=>{} }) {
  const PlaceholderImage = Src(categoria) || require('@/assets/images/punto.png');  ;
  const [deleteN, setDeleteN] = useState(false);
  const [permiso, setPermiso] = useState(false);

  const seleccion = () => {
    setDeleteN(true);
    setTimeout(() => {
      setPermiso(true);
    }, 500);
  
    setTimeout(() => {
      setDeleteN(false);
      setPermiso(false);
    }, 7000);
  };
  

  return (
    <View style={[styles.nota, { backgroundColor: useTheme() ? 'transparent' : color, borderColor: color, borderWidth: 2, position: "relative", overflow: "hidden" }]}>
      <TouchableOpacity
        style={{ position: "relative", width: "100%", height: "auto", minHeight: 120, borderRadius: 10, padding: 10 }}
        onLongPress={seleccion} onPress={()=>{update?.(id);}}>
        <Image style={styles.image} source={PlaceholderImage} />
        <Text style={[useGlobalStyles().negrita, useGlobalStyles().text]}>{title}</Text>
        <Text style={useGlobalStyles().text}>{context}</Text>
      </TouchableOpacity>
      {deleteN && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0000007F",
            zIndex: 70,
          }}
        >
          <TouchableOpacity onPress={() => {if(permiso){deleteFn?.(id);}}} style={styles.deleteButton}>
            <Image source={basura} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nota: {
    borderRadius: 10,
    width: "80%",
    height: "auto",
    minHeight: 120,
    marginHorizontal: "10%",
    marginVertical: 10,
  },
  image: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 5,
    right: 5,
  },
  deleteButton: {
    width: 70,
    height: 70,
    borderRadius: 35, // Usar la mitad del ancho/alto para un círculo perfecto
    borderWidth: 2,
    borderColor: "white",
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteIcon: {
    width: 40,
    height: 40,
  },
});

export function CategoriaView({nombre = '', color='black'}) {
  return(
    <Text style={[useGlobalStyles().negrita, useGlobalStyles().text, {borderColor:color, borderBottomWidth:2}]}>{nombre}</Text>
  );
}