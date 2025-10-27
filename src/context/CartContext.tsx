import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Empanada, ItemCarrito, PromocionCarrito } from '../types'

interface CartContextType {
  items: ItemCarrito[]
  promociones: PromocionCarrito[]
  addItem: (empanada: Empanada, cantidad?: number) => void
  removeItem: (empanada: Empanada) => void
  updateQuantity: (empanada: Empanada, cantidad: number) => void
  addPromocion: (promocion: PromocionCarrito) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [promociones, setPromociones] = useState<PromocionCarrito[]>([])

  const addItem = (empanada: Empanada, cantidad: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.empanada._id === empanada._id)
      
      if (existingItem) {
        return prev.map(item =>
          item.empanada._id === empanada._id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }
      
      return [...prev, { empanada, cantidad }]
    })
  }

  const removeItem = (empanada: Empanada) => {
    setItems(prev => prev.filter(item => item.empanada._id !== empanada._id))
  }

  const updateQuantity = (empanada: Empanada, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(empanada)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.empanada._id === empanada._id
          ? { ...item, cantidad }
          : item
      )
    )
  }

  const addPromocion = (promocion: PromocionCarrito) => {
    setPromociones(prev => [...prev, promocion])
  }

  const clearCart = () => {
    setItems([])
    setPromociones([])
  }

  const getTotal = () => {
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.empanada.precio * item.cantidad,
      0
    )
    
    const promocionesTotal = promociones.reduce(
      (sum, promo) => sum + promo.promocion.precio,
      0
    )
    
    return itemsTotal + promocionesTotal
  }

  const getTotalItems = () => {
    const itemsCount = items.reduce((sum, item) => sum + item.cantidad, 0)
    const promocionesCount = promociones.reduce(
      (sum, promo) => sum + promo.promocion.cantidadTotal,
      0
    )
    
    return itemsCount + promocionesCount
  }

  return (
    <CartContext.Provider
      value={{
        items,
        promociones,
        addItem,
        removeItem,
        updateQuantity,
        addPromocion,
        clearCart,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}