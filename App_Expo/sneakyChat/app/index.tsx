import { Text, View } from "react-native";
import { Link} from "expo-router";
import { useGlobalStyles } from "./recursos/style";
import { useCallback, useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={useGlobalStyles().container}>
      <Text style={useGlobalStyles().text}>Pantalla de inicio.</Text>
      <Link href={"/registro_user"} style={useGlobalStyles().link}>ir a pantalla de registro</Link>
      <Link href={"/registro_sala"} style={useGlobalStyles().link}>ir a pantalla de registro de sala</Link>
      <Link href={"/mensajeria"} style={useGlobalStyles().link}>ir a pantalla de mensajes</Link>
    </View>
  );}