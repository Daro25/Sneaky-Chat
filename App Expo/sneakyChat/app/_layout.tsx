import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title:'Home'}}/>
      <Stack.Screen name="registro_user" options={{title:'Registro de usuario'}}/>
    </Stack>
  );
}
