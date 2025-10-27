import type { Categoria, Empanada, Promocion, Configuracion } from '../types'

// Categorías mock
export const mockCategorias: Categoria[] = [
  {
    _id: 'cat-1',
    nombre: 'Clásicas',
    descripcion: 'Las empanadas tradicionales de siempre',
    orden: 0,
  },
  {
    _id: 'cat-2',
    nombre: 'Especiales',
    descripcion: 'Sabores únicos y diferentes',
    orden: 1,
  },
]

// Empanadas mock
export const mockEmpanadas: Empanada[] = [
  {
    _id: 'emp-1',
    nombre: 'Carne',
    descripcion: 'Carne picada, cebolla, huevo, aceitunas',
    precio: 800,
    disponible: true,
    orden: 0,
    categoria: mockCategorias[0],
  },
  {
    _id: 'emp-2',
    nombre: 'Jamón y Queso',
    descripcion: 'Jamón cocido y queso cremoso',
    precio: 750,
    disponible: true,
    orden: 1,
    categoria: mockCategorias[0],
  },
  {
    _id: 'emp-3',
    nombre: 'Pollo',
    descripcion: 'Pollo desmenuzado con verduras',
    precio: 800,
    disponible: true,
    orden: 2,
    categoria: mockCategorias[0],
  },
  {
    _id: 'emp-4',
    nombre: 'Humita',
    descripcion: 'Choclo cremoso con especias',
    precio: 700,
    disponible: true,
    orden: 3,
    categoria: mockCategorias[0],
  },
  {
    _id: 'emp-5',
    nombre: 'Caprese',
    descripcion: 'Tomate, mozzarella y albahaca',
    precio: 850,
    disponible: true,
    orden: 4,
    categoria: mockCategorias[1],
  },
  {
    _id: 'emp-6',
    nombre: 'Roquefort',
    descripcion: 'Queso roquefort con nueces',
    precio: 900,
    disponible: true,
    orden: 5,
    categoria: mockCategorias[1],
  },
  {
    _id: 'emp-7',
    nombre: 'Carne Picante',
    descripcion: 'Carne con ají y pimientos',
    precio: 850,
    disponible: true,
    orden: 6,
    categoria: mockCategorias[1],
  },
]

// Promociones mock
export const mockPromociones: Promocion[] = [
  {
    _id: 'promo-1',
    nombre: '🔥 Promo Viernes',
    descripcion: 'Docena de empanadas: 6 de carne + 6 de jamón y queso',
    precio: 8500,
    cantidadTotal: 12,
    tipo: 'gustos_fijos',
    activa: true,
    destacada: true,
    orden: 0,
    gustosPredeterminados: [
      {
        empanada: mockEmpanadas[0], // Carne
        cantidad: 6,
      },
      {
        empanada: mockEmpanadas[1], // JyQ
        cantidad: 6,
      },
    ],
  },
  {
    _id: 'promo-2',
    nombre: '✨ Media Docena a Elección',
    descripcion: '6 empanadas de los sabores que quieras',
    precio: 4200,
    cantidadTotal: 6,
    tipo: 'gustos_a_eleccion',
    activa: true,
    destacada: true,
    orden: 1,
  },
  {
    _id: 'promo-3',
    nombre: 'Docena de JyQ',
    descripcion: '12 empanadas de jamón y queso',
    precio: 8000,
    cantidadTotal: 12,
    tipo: 'sabor_especifico',
    activa: true,
    destacada: false,
    orden: 2,
    gustosPredeterminados: [
      {
        empanada: mockEmpanadas[1], // JyQ
        cantidad: 12,
      },
    ],
  },
]

// Configuración mock
export const mockConfiguracion: Configuracion = {
  _id: 'config-1',
  nombreNegocio: 'Empanadas La Juana',
  telefono: '5493364203556',
  mensajeBienvenida: '¡Bienvenidos! Hacé tu pedido y te lo llevamos a tu casa 🏠',
  horarioAtencion: 'Lunes a Sábados de 19:00 a 00:00',
  metodosPago: ['Efectivo', 'Transferencia', 'MercadoPago'],
  costoEnvio: 500,
  minimoParaEnvio: 3000,
  activo: true,
  mensajeCerrado: 'Estamos cerrados temporalmente. Volvemos pronto!',
}