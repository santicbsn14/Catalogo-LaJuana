export interface Categoria {
  _id: string
  nombre: string
  descripcion?: string
  orden: number
}

export interface Empanada {
  _id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen?: unknown
  categoria: Categoria
  disponible: boolean
  orden: number
}

export interface GustoPredeterminado {
  empanada: Empanada
  cantidad: number
}

export type TipoPromocion = 'gustos_fijos' | 'gustos_a_eleccion' | 'sabor_especifico'

export interface Promocion {
  _id: string
  nombre: string
  descripcion: string
  precio: number
  cantidadTotal: number
  tipo: TipoPromocion
  gustosPredeterminados?: GustoPredeterminado[]
  imagen?: unknown
  activa: boolean
  destacada: boolean
  orden: number
}

export interface Configuracion {
  _id: string
  nombreNegocio: string
  telefono: string
  mensajeBienvenida?: string
  horarioAtencion?: string
  metodosPago?: string[]
  costoEnvio: number
  minimoParaEnvio: number
  activo: boolean
  mensajeCerrado?: string
}

export interface ItemCarrito {
  empanada: Empanada
  cantidad: number
}

export interface PromocionCarrito {
  promocion: Promocion
  gustosSeleccionados?: ItemCarrito[]
}