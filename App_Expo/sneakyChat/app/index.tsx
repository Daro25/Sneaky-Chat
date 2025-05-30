import { useGlobalStyles, useTheme } from "./recursos/style";
import React, {useState, useEffect} from "react";
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Nota , Categoria } from "@/db/schema";
import { View, FlatList, TouchableOpacity, Text, Pressable} from "react-native";
import NotaView, { CategoriaView } from "@/assets/Componentes/Nota";
import { Href, router } from "expo-router";
import { Image } from 'expo-image';
import { eq } from "drizzle-orm";

export default function Index() {
  //base de datos mas facil con drizzle
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema});
  const [Notas, setNotas] = useState<Nota[]>([]);
  const [Categorias, setCategorias] = useState<Categoria[]>([])
  const PlaceholderImage = require('../assets/images/agregar.png')
  const [lastId, setLastId] = useState(0);
 
  const consulta = async () => {
    let newid = lastId;
    try {
      const result = await drizzleDb.select().from(schema.notas);
      let reverse = result.reverse();
      setNotas(reverse);
      newid = reverse[0].id;
    } catch (error) {
      setNotas([]);
    }
    setLastId(newid);
    try {
      const result = (await drizzleDb.select().from(schema.categoria));
      if (Categorias.length != result.length) {
        setCategorias(result);
      }
    } catch (error) {
      setCategorias([]);
    }
  } 
  useEffect(()=>{consulta()},[]);
  useEffect(()=>{
    let interval = setInterval(()=>consulta(), 1000);
    return () => clearInterval(interval);
  },[lastId]);
  const getColor = (id: number): string | undefined => {
    const categoria = Categorias.find(element => element.idCategoria === id);
    return categoria?.color;
  };
  const deleteForId = async (id: any)=> {
    await drizzleDb.delete(schema.notas).where(eq(schema.notas.id, id));
    await consulta()
  }
  const updateForId = async (id: number) => {
    const result = await drizzleDb.select().from(schema.notas).where(eq(schema.notas.id, id));
    if (result.length>0) {
      const href: Href = `./${id}`;
      router.push(href);
    }
  };
  useEffect(()=>{
    setTimeout(()=>{
      const accion = async ()=>{
        const userResult = await drizzleDb.select().from(schema.datosp);
        const salaResult = await drizzleDb.select().from(schema.salas);
        if(userResult.length === 0){
          router.replace('./registro_user');
        }
        else if (salaResult.length === 0) {
          router.replace('./login_sala');
        }   
      }
      accion();
    },2000);
  },[]);
  useEffect(()=>{
    const accion = async ()=>{
      const categoriaResult = await drizzleDb.select().from(schema.categoria);

      if (categoriaResult.length === 0){
        await drizzleDb.insert(schema.categoria).values([
          { nombre: 'Nulo', color: '#9B7EBD' },
          { nombre: 'Primordial', color: '#FAEDCB' },
          { nombre: 'Hogar', color: '#9B7EBD' },
          { nombre: 'Pagos', color: '#C9E4DE' },
          { nombre: 'Escuela', color: '#C6DEF1' },
          { nombre: 'Trabajo', color: '#F7D9C4' },]);
      }
      consulta();
    };
    accion();//insertamos datos en la tabla catalogo
  }, []); 
  const addNota = ()=>{
    router.push('./0');
    consulta();
  };
  const [errors, setError] = useState('');
  try {
    Categorias.forEach(element => {
      element.idCategoria;
      element.nombre;
      element.color;
    });

  } catch (e) {
    setError(reportError.toString());
  }
  if(errors === ''){
  return (
    <View style={useGlobalStyles().container}>
      <FlatList style={{width:'100%', position:'relative'}} data={Notas} renderItem={({item})=>(
        <NotaView 
        title={item.titulo} 
        context={String(item.descripcion)} 
        categoria={Number(item.idCategoria)} 
        id={item.id} 
        color={getColor(Number(item.idCategoria))}
        deleteFn={deleteForId}
        update={updateForId}/>
      )}
      keyExtractor={item => item.id.toString()}/>
      
      <TouchableOpacity style={{width: 'auto', display:'flex', position:'absolute', bottom:7, right: 7, padding: 10, borderRadius: 45, alignItems: 'center',justifyContent: 'center',zIndex:20}}
        onPress={addNota}>
          <Image style={{width: 90, height: 90, borderRadius:45}} source={PlaceholderImage}/>
      </TouchableOpacity>

      <View style={{backgroundColor: useTheme()? 'black': '#BE8ED0',overflow:'hidden', borderRadius: 10, width:'70%', height: 'auto', padding: 9, alignSelf:'flex-start', margin:10}}>
        <Text style={[useGlobalStyles().negrita, useGlobalStyles().text]}>Categorias:</Text>
        <View style={[useGlobalStyles().container_H, [{height:'auto', minHeight:120, maxHeight:'40%'}]]}>
          <Pressable style={{width: '47%', justifyContent: 'center', height:'auto', backgroundColor: '#9B7EBD', borderRadius:10,}}
          onPress={()=> router.push('./crearCate')}><Text style={{color:'white'}}>Añadir Categoria</Text></Pressable>
        {Categorias.length > 0 && (
          <FlatList
            style={{ width: '47%', justifyContent: 'center', height:'auto', marginVertical:12 }}
            data={Categorias}
            renderItem={({ item }) => (
              <CategoriaView nombre={item.nombre.toString()} color={item.color.toString()} />
            )}
            keyExtractor={item => item.idCategoria.toString()}
          />
        )}
        </View>
      </View>
      
    </View>
  );
}else {
  return(
    <Text>{errors}</Text>
  );
}
}