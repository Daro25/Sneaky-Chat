import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
        screenOptions ={{
          statusBarBackgroundColor: '#ffd33d',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
        }}>
      <Stack.Screen name="index" options={{title:'Home'}}/>
      <Stack.Screen name="registro_user" options={{title:'Registro de usuario'}}/>
    </Stack>
  );
}
