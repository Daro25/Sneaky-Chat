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
        default: return '#9B7EBD'
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