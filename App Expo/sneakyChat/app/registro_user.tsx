import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { TextInput } from "react-native-gesture-handler";

export default function Registro_user() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de registro.</Text>
      <TextInput />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff'
  }
});