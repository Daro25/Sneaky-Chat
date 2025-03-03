import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "./recursos/style";

export default function Index() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Pantalla de inicio.</Text>
      <Link href={"/registro_user"} style={globalStyles.link}>ir a pantalla de registro</Link>
    </View>
  );}