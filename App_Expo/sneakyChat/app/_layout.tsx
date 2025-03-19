import { Stack } from "expo-router";
import { head } from "./recursos/style";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import { Suspense } from 'react';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export const DATABASE_NAME = 'SneakyChatDB';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense>
    <Stack
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
    </Stack><StatusBar style="light" />
    </SQLiteProvider>
    </Suspense>
  );
  }
