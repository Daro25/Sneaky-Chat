import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGlobalStyles } from "@/app/recursos/style";
import { Src, basura } from "@/app/recursos/categorias";
import { Image } from "expo-image";

export default function NotaView(props) {
  const PlaceholderImage = Src(props.categoria);
  const [deleteN, setDeleteN] = useState(false);
  const [permiso, setPermiso] = useState(false);

  const deseleccion = () => {
    setDeleteN(false);
    setPermiso(false);
  };

  const seleccion = () => {
    setDeleteN(true);
    setTimeout(deseleccion, 7000);
    setTimeout(setPermiso(true), 2000);
  };

  return (
    <View style={[styles.nota, { backgroundColor: props.color, position: "relative", overflow: "hidden" }]}>
      <TouchableOpacity
        style={{ position: "relative", width: "100%", height: "auto", minHeight: 120, borderRadius: 10, padding: 10 }}
        onLongPress={seleccion} onPress={()=>{props.update(props.id)}}>
        <Image style={styles.image} source={PlaceholderImage} />
        <Text style={[useGlobalStyles().negrita, styles.textNormal]}>{props.title}</Text>
        <Text style={styles.textNormal}>{props.context}</Text>
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
          <TouchableOpacity onPress={() => {if(permiso){props.delete(props.id);}}} style={styles.deleteButton}>
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
  textNormal: {
    color: "black"
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