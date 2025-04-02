import * as SecureStore from 'expo-secure-store';

const guardarLlavePrivada = async (llavePrivada: string) => {
  await SecureStore.setItemAsync('llavePrivada', llavePrivada);
};
export function GuardarLlavePrivada(llavePrivada: string) {
  guardarLlavePrivada(llavePrivada);
}
const obtenerLlavePrivada = async () => {
  const llavePrivada = await SecureStore.getItemAsync('llavePrivada');
  return llavePrivada;
};
 export default function ObtenerLlavePrivada (){
  return obtenerLlavePrivada();
 }
