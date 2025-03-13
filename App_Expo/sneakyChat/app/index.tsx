import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useGlobalStyles } from "./recursos/style";
export default function Index() {
  return (
    <View style={useGlobalStyles().container}>
      <Text style={useGlobalStyles().text}>Pantalla de inicio.</Text>
      <Link href={"/registro_user"} style={useGlobalStyles().link}>Ir a pantalla de registro</Link>
      <Link href={"/registro_sala"} style={useGlobalStyles().link}>Ir a pantalla de registro de sala</Link>
      <Link href={"/mensajeria"} style={useGlobalStyles().link}>Ir a pantalla de mensajes</Link>
    </View>
  );
}