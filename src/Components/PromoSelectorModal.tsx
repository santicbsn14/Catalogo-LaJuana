import { useState } from 'react'
import type { Promocion, Empanada, ItemCarrito } from '../types'

interface PromoSelectorModalProps {
  promocion: Promocion
  empanadasDisponibles: Empanada[]
  onConfirm: (gustosSeleccionados: ItemCarrito[]) => void
  onClose: () => void
}

export default function PromoSelectorModal({ 
  promocion, 
  empanadasDisponibles, 
  onConfirm, 
  onClose 
}: PromoSelectorModalProps) {
  const [gustosSeleccionados, setGustosSeleccionados] = useState<ItemCarrito[]>([])

  const totalSeleccionado = gustosSeleccionados.reduce((sum, item) => sum + item.cantidad, 0)
  const faltanEmpanadas = promocion.cantidadTotal - totalSeleccionado

  const handleAgregarGusto = (empanada: Empanada) => {
    setGustosSeleccionados(prev => {
      const existente = prev.find(item => item.empanada._id === empanada._id)
      
      if (existente) {
        return prev.map(item =>
          item.empanada._id === empanada._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      
      return [...prev, { empanada, cantidad: 1 }]
    })
  }

  const handleQuitarGusto = (empanada: Empanada) => {
    setGustosSeleccionados(prev => {
      const existente = prev.find(item => item.empanada._id === empanada._id)
      
      if (!existente) return prev
      
      if (existente.cantidad === 1) {
        return prev.filter(item => item.empanada._id !== empanada._id)
      }
      
      return prev.map(item =>
        item.empanada._id === empanada._id
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    })
  }

  const getCantidadSeleccionada = (empanada: Empanada) => {
    const item = gustosSeleccionados.find(g => g.empanada._id === empanada._id)
    return item?.cantidad || 0
  }

  const handleConfirmar = () => {
    if (totalSeleccionado === promocion.cantidadTotal) {
      onConfirm(gustosSeleccionados)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎉 {promocion.nombre}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="promo-selector-info">
            <p className="promo-selector-description">{promocion.descripcion}</p>
            <p className="promo-selector-counter">
              Seleccionadas: <strong>{totalSeleccionado}/{promocion.cantidadTotal}</strong>
              {faltanEmpanadas > 0 && (
                <span className="promo-selector-faltante"> (faltan {faltanEmpanadas})</span>
              )}
            </p>
          </div>

          <div className="promo-selector-list">
            {empanadasDisponibles.map(empanada => {
              const cantidadSeleccionada = getCantidadSeleccionada(empanada)
              const puedeAgregar = totalSeleccionado < promocion.cantidadTotal
              
              return (
                <div key={empanada._id} className="promo-selector-item">
                  <div className="promo-selector-item-info">
                    <h4>{empanada.nombre}</h4>
                    {cantidadSeleccionada > 0 && (
                      <span className="promo-selector-badge">{cantidadSeleccionada}</span>
                    )}
                  </div>
                  
                  <div className="promo-selector-actions">
                    {cantidadSeleccionada > 0 && (
                      <button 
                        className="btn-selector-minus"
                        onClick={() => handleQuitarGusto(empanada)}
                      >
                        -
                      </button>
                    )}
                    
                    <button 
                      className="btn-selector-plus"
                      onClick={() => handleAgregarGusto(empanada)}
                      disabled={!puedeAgregar}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-primary" 
            onClick={handleConfirmar}
            disabled={totalSeleccionado !== promocion.cantidadTotal}
          >
            Agregar al pedido (${promocion.precio})
          </button>
        </div>
      </div>
    </div>
  )
}