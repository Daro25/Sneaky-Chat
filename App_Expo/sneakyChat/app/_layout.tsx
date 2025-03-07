import { Stack } from "expo-router";
import { head } from "./recursos/style";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <><Stack
      screenOptions={{
        statusBarBackgroundColor: '#ffd33d',
        headerStyle: {
          backgroundColor: head,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="registro_user" options={{ title: 'Registro de usuario' }} />
      <Stack.Screen name="registro_sala" options={{ title: 'Registro de sala' }} />
    </Stack><StatusBar style="light" /></>
  );
}
