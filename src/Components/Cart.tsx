import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import CheckoutForm from './CheckoutForm'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, promociones, updateQuantity, removeItem, getTotal, getTotalItems } = useCart()
   const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])
  if (!isOpen) return null

  if (showCheckout) {
    return <CheckoutForm onBack={() => setShowCheckout(false)} onClose={onClose} />
  }

  return (
    <div className="modal-overlay" onClick={onClose} onTouchMove={(e) => {
  if (e.target === e.currentTarget) {
    e.preventDefault()
  } }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Tu Pedido</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {getTotalItems() === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <p className="empty-cart-subtitle">¡Agregá algunas empanadas!</p>
            </div>
          ) : (
            <>
              {/* Promociones */}
              {promociones.length > 0 && (
                <div className="cart-section">
                  <h3 className="cart-section-title">Promociones</h3>
                  {promociones.map((promo, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{promo.promocion.nombre}</h4>
                        <p className="cart-item-description">{promo.promocion.descripcion}</p>
                      </div>
                      <div className="cart-item-price">
                        ${promo.promocion.precio}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Items individuales */}
              {items.length > 0 && (
                <div className="cart-section">
                  <h3 className="cart-section-title">Empanadas</h3>
                  {items.map((item) => (
                    <div key={item.empanada._id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.empanada.nombre}</h4>
                        <p className="cart-item-price-unit">${item.empanada.precio} c/u</p>
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.empanada, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="quantity">{item.cantidad}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.empanada, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="cart-item-total">
                          ${item.empanada.precio * item.cantidad}
                        </div>
                        
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.empanada)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="cart-total">
                <div className="cart-total-row">
                  <span>Subtotal ({getTotalItems()} empanadas)</span>
                  <span className="cart-total-amount">${getTotal()}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {getTotalItems() > 0 && (
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Seguir comprando
            </button>
            <button className="btn-primary" onClick={() => setShowCheckout(true)}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}