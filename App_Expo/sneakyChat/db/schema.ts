import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const categoria = sqliteTable('CATEGORIA', {
  idCategoria: integer('ID_categoria').primaryKey({ autoIncrement: true }),
  nombre: text('Nombre', { length: 40 }).notNull(),
  color: text('Color', {length: 7}).notNull()
});

export const notas = sqliteTable('NOTAS', {
  id: integer('ID').primaryKey({ autoIncrement: true }),
  titulo: text('Titulo', { length: 40 }).notNull(),
  descripcion: text('Descripcion', { length: 250 }),
  idCategoria: integer('ID_categoria').references(() => categoria.idCategoria),
});

export const mensaje = sqliteTable('MENSAJE', {
  id: integer('ID').primaryKey({ autoIncrement: true }),
  sala: text('Sala', { length: 20 }).notNull(),
  dates: text('Dates').notNull(),
  texto: text('Texto', { length: 200 }).notNull(),
  idUser: text('Id_User', { length: 40 }).notNull(),
});

export const datosp = sqliteTable('DATOSP', {
  id: integer('ID').primaryKey({ autoIncrement: true }),
  pass: text('pass', { length: 20 }).notNull(),
  idUser: text('Id_User', { length: 40 }).notNull(),
  year: integer('Year').notNull()
});

export const salas = sqliteTable('SALAS', {
  idSala: integer('Id_sala', { mode: "number" }).notNull(),
  pass: text('pass', { length: 20 }).notNull(),
  nombre: text('nombre', { length: 20 }).notNull(),
});

export const emisor = sqliteTable('EMISOR', {
  id: integer('ID').primaryKey({ autoIncrement: true }),
  e: text('e'),
  n: text('n', { length: 2048 }),
  idUser: text('Id_User', { length: 40 }).notNull(),
});
export type Nota = typeof notas.$inferSelect;
export type Categoria = typeof categoria.$inferSelect;
export type Msj = typeof mensaje.$inferSelect;
export type DatosP = typeof datosp.$inferSelect;
export type Sala = typeof salas.$inferSelect;
export type Emisor = typeof emisor.$inferSelect;