import { useState, useEffect } from 'react'
import type {FormEvent} from 'react'
import { useCart } from '../context/CartContext'
import type { Configuracion } from '../types'

interface CheckoutFormProps {
  onBack: () => void
  onClose: () => void
  config: Configuracion | null
}

interface FormData {
  nombre: string
  telefono: string
  tipoEntrega: 'retiro' | 'envio'
  direccion: string
  tipoCoccion: 'horno' | 'fritas'
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

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    let mensaje = `*NUEVO PEDIDO*\n\n`
    mensaje += `*Cliente:* ${formData.nombre}\n`
    mensaje += `*Teléfono:* ${formData.telefono}\n`
    mensaje += `*Tipo:* ${formData.tipoEntrega === 'retiro' ? 'Retiro en local' : 'Envío a domicilio'}\n`
    mensaje += `*Cocción:* ${formData.tipoCoccion === 'horno' ? 'Al horno' : 'Fritas'}\n`
    
    if (formData.tipoEntrega === 'envio') {
      mensaje += `*Dirección:* ${formData.direccion}\n`
    }
    
    mensaje += `\n*DETALLE DEL PEDIDO:*\n\n`
    
    if (promociones.length > 0) {
      mensaje += `*Promociones:*\n`
      promociones.forEach((promo) => {
        mensaje += `• ${promo.promocion.nombre} - $${promo.promocion.precio}\n`
        // Si tiene gustos seleccionados, mostrarlos
        if (promo.gustosSeleccionados && promo.gustosSeleccionados.length > 0) {
          promo.gustosSeleccionados.forEach((gusto) => {
            mensaje += `  - ${gusto.cantidad}x ${gusto.empanada.nombre}\n`
          })
        }
      })
      mensaje += `\n`
    }
    
    if (items.length > 0) {
      mensaje += `*Empanadas:*\n`
      items.forEach((item) => {
        mensaje += `• ${item.cantidad}x ${item.empanada.nombre} - $${item.empanada.precio * item.cantidad}\n`
      })
      mensaje += `\n`
    }
    
    mensaje += `*TOTAL: $${getTotal()}*\n`
    
    if (formData.aclaraciones) {
      mensaje += `\n*Aclaraciones:* ${formData.aclaraciones}`
    }
    
    const mensajeCodificado = encodeURIComponent(mensaje)
    const urlWhatsApp = `https://wa.me/${config?.telefono}?text=${mensajeCodificado}`
    
    window.open(urlWhatsApp, '_blank')
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
      <div className="modal-content" style={{ maxHeight: '90vh' }}>
        <div className="modal-header">
          <h2>📋 Datos de Entrega</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
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
              {formData.tipoEntrega === 'envio' && config?.costoEnvio && config.costoEnvio > 0 && (
                <p className="summary-note">+ ${config.costoEnvio} de envío (a confirmar)</p>
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