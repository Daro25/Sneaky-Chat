import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";

export function useCategorias() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [categorias, setCategorias] = useState<{ id: number; nombre: string, color: string}[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const result = await drizzleDb.select().from(schema.categoria);

        // Si la consulta está vacía, usa las categorías predeterminadas
        if (result.length === 0) {
          setCategorias([
            { id: 1, nombre: "Nulo", color: '#9B7EBD' },
            { id: 2, nombre: "Primordial" , color: '#FAEDCB'},
            { id: 3, nombre: "Hogar" , color: '#9B7EBD'},
            { id: 4, nombre: "Pagos" , color: '#C9E4DE'},
            { id: 5, nombre: "Escuela" , color: '#C6DEF1'},
            { id: 6, nombre: "Trabajo" , color: '#F7D9C4'},
          ]);
        } else {
          // Si hay datos en la DB, los usamos
          setCategorias(result.map((cat) => ({ id: cat.idCategoria, nombre: cat.nombre, color: cat.color })));
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return categorias;
}

export function Src(i: number): any {
    switch (i) {
        case 1: return require ('../../assets/images/punto.png')
        case 2: return  require ('../../assets/images/corona.png')
        case 3: return require ('../../assets/images/casa.png')
        case 4: return  require ('../../assets/images/moneda.png')
        case 5: return  require ('../../assets/images/escuela.png')
        case 6: return  require ('../../assets/images/chamba.png')
        default: return require ('../../assets/images/punto.png')
    }
}
export function Bgcolor(i: Number): string{
    switch (i) {
        case 1: return '#9B7EBD'
        case 2: return '#FAEDCB'
        case 3: return '#9B7EBD'
        case 4: return '#C9E4DE'
        case 5: return '#C6DEF1'
        case 6: return '#F7D9C4'
        default: return '#FAEDCB'
    }
}

const Categorias = [
        {id: 1, nombre: 'Nulo'}, 
        {id: 2, nombre: 'Primordial'}, 
        {id: 3, nombre: 'Hogar'}, 
        {id: 4, nombre: 'Pagos'}, 
        {id: 5, nombre: 'Escuela'}, 
        {id: 6, nombre: 'Trabajo'}];

export default Categorias;
 export const basura = require('../../assets/images/papeBin.png');