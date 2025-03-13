import * as SecureStore from 'expo-secure-store';

const guardarLlavePrivada = async (llavePrivada: string) => {
  await SecureStore.setItemAsync('llavePrivada', llavePrivada);
};

const obtenerLlavePrivada = async () => {
  const llavePrivada = await SecureStore.getItemAsync('llavePrivada');
  return llavePrivada;
};

export { guardarLlavePrivada, obtenerLlavePrivada };
