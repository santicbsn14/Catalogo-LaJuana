import { useState } from 'react'
import type {FormEvent} from 'react'
import { useCart } from '../context/CartContext'
import { mockConfiguracion } from '../data/mockData'
import type { Configuracion } from '../types'
interface CheckoutFormProps {
  onBack: () => void
  onClose: () => void
  config: Configuracion | null  // Agregá esto
}
interface FormData {
  nombre: string
  telefono: string
  tipoEntrega: 'retiro' | 'envio'
  direccion: string
  tipoCoccion: 'horno' | 'fritas'  // Agregá esto
  aclaraciones: string
}

export default function CheckoutForm({ onBack, onClose, config }: CheckoutFormProps) {
  const { items, promociones, getTotal, clearCart } = useCart()
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    tipoEntrega: 'retiro',
    direccion: '',
    tipoCoccion: 'horno',
    aclaraciones: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Generar mensaje de WhatsApp
    let mensaje = `*NUEVO PEDIDO*\n\n`
    mensaje += `*Cliente:* ${formData.nombre}\n`
    mensaje += `*Teléfono:* ${formData.telefono}\n`
    mensaje += `*Tipo:* ${formData.tipoEntrega === 'retiro' ? 'Retiro en local' : 'Envío a domicilio'}\n`
    mensaje += `*Cocción:* ${formData.tipoCoccion === 'horno' ? 'Al horno' : 'Fritas'}\n`  // Agregá esto
    
    if (formData.tipoEntrega === 'envio') {
      mensaje += `*Dirección:* ${formData.direccion}\n`
    }
    
    mensaje += `\n*DETALLE DEL PEDIDO:*\n\n`
    
    // Agregar promociones
    if (promociones.length > 0) {
      mensaje += ` *Promociones:*\n`
      promociones.forEach((promo) => {
        mensaje += `• ${promo.promocion.nombre} - $${promo.promocion.precio}\n`
      })
      mensaje += `\n`
    }
    
    // Agregar items
    if (items.length > 0) {
      mensaje += ` *Empanadas:*\n`
      items.forEach((item) => {
        mensaje += `• ${item.cantidad}x ${item.empanada.nombre} - $${item.empanada.precio * item.cantidad}\n`
      })
      mensaje += `\n`
    }
    
    mensaje += ` *TOTAL: $${getTotal()}*\n`
    
    if (formData.aclaraciones) {
      mensaje += `\n *Aclaraciones:* ${formData.aclaraciones}`
    }
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje)
    const urlWhatsApp = `https://wa.me/${config?.telefono}?text=${mensajeCodificado}`
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank')
    
    // Limpiar carrito y cerrar
    clearCart()
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>📋 Datos de Entrega</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="1123456789"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoEntrega">Tipo de entrega *</label>
              <select
                id="tipoEntrega"
                name="tipoEntrega"
                value={formData.tipoEntrega}
                onChange={handleChange}
                required
              >
                <option value="retiro">Retiro en local</option>
                <option value="envio">Envío a domicilio</option>
              </select>
            </div>
                <div className="form-group">
      <label htmlFor="tipoCoccion">Tipo de cocción *</label>
      <select
        id="tipoCoccion"
        name="tipoCoccion"
        value={formData.tipoCoccion}
        onChange={handleChange}
        required
      >
        <option value="horno">Al horno</option>
        <option value="fritas">Fritas</option>
      </select>
    </div>

            {formData.tipoEntrega === 'envio' && (
              <div className="form-group">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Calle 123, Piso 4, Depto B"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="aclaraciones">Aclaraciones</label>
              <textarea
                id="aclaraciones"
                name="aclaraciones"
                value={formData.aclaraciones}
                onChange={handleChange}
                rows={3}
                placeholder="Ej: Sin cebolla, timbre roto, etc."
              />
            </div>

            <div className="order-summary">
              <h3>Resumen del pedido</h3>
              <div className="summary-row">
                <span>Total a pagar:</span>
                <span className="summary-total">${getTotal()}</span>
              </div>
              {formData.tipoEntrega === 'envio' && mockConfiguracion.costoEnvio > 0 && (
                <p className="summary-note">+ ${mockConfiguracion.costoEnvio} de envío (a confirmar)</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onBack}>
              Volver
            </button>
            <button type="submit" className="btn-primary">
              Enviar por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}