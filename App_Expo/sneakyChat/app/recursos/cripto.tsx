import RNRsaNative, { RSA } from 'react-native-rsa-native';

export const generateKeys = async () => {
  try {
    const keys = await RSA.generateKeys(512);
    
    console.log('Clave Pública:', keys.public);
    console.log('Clave Privada:', keys.private);
  } catch (error) {
    console.error('Error generando las claves:', error);
  }
};
export const encryptMessage = async (message: string, publicKey: string) => {
  try {
    const encrypted = await RSA.encrypt(message, publicKey);
    console.log('Mensaje Encriptado:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error encriptando:', error);
  }
};

export const decryptMessage = async (encryptedMessage: string, privateKey: string) => {
  try {
    const decrypted = await RSA.decrypt(encryptedMessage, privateKey);
    console.log('Mensaje Desencriptado:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('Error desencriptando:', error);
  }
};

import * as Keychain from 'react-native-keychain';

export const savePrivateKey = async (privateKey: string) => {
  try {
    await Keychain.setGenericPassword('privateKey', privateKey);
    console.log('Clave privada guardada de forma segura.');
  } catch (error) {
    console.error('Error guardando la clave privada:', error);
  }
};

export const getPrivateKey = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log('Clave privada obtenida:', credentials.password);
      return credentials.password;
    } else {
      console.log('No se encontró la clave privada.');
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo la clave privada:', error);
  }
};
export default function name() {}