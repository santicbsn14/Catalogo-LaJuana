import { useEffect, useState } from 'react'
import { client } from './lib/sanity'
import type { Configuracion, Empanada, Promocion, PromocionCarrito, ItemCarrito } from './types'
import { useCart } from './context/CartContext'
import CartModal from './Components/Cart'
import PromoSelectorModal from './Components/PromoSelectorModal'
import log from './Components/Logo400px.png'

function App() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [empanadas, setEmpanadas] = useState<Empanada[]>([])
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showSplash, setShowSplash] = useState(true)
  const [selectedPromo, setSelectedPromo] = useState<Promocion | null>(null)

  const { addItem, addPromocion, getTotal, getTotalItems } = useCart()

  const handleAddItem = (empanada: Empanada) => {
    addItem(empanada)
    setToastMessage(`${empanada.nombre} agregada!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleAddPromocion = (promocion: Promocion) => {
    if (promocion.tipo === 'gustos_a_eleccion') {
      // Abrir modal para seleccionar gustos
      setSelectedPromo(promocion)
    } else if (promocion.tipo === 'gustos_fijos' || promocion.tipo === 'sabor_especifico') {
      // Agregar directamente con gustos predeterminados
      const promoCarrito: PromocionCarrito = {
        promocion,
        gustosSeleccionados: promocion.gustosPredeterminados?.map(gp => ({
          empanada: gp.empanada,
          cantidad: gp.cantidad
        }))
      }
      addPromocion(promoCarrito)
      setToastMessage(`${promocion.nombre} agregada!`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handlePromoSelectorConfirm = (gustosSeleccionados: ItemCarrito[]) => {
    if (selectedPromo) {
      const promoCarrito: PromocionCarrito = {
        promocion: selectedPromo,
        gustosSeleccionados
      }
      addPromocion(promoCarrito)
      setToastMessage(`${selectedPromo.nombre} agregada!`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      setSelectedPromo(null)
    }
  }

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(splashTimer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configData = await client.fetch<Configuracion>(
          `*[_type == "configuracion"][0]`
        )
        setConfig(configData)

        const empanadasData = await client.fetch<Empanada[]>(
          `*[_type == "empanada" && disponible == true] | order(orden asc) {
            _id,
            nombre,
            descripcion,
            precio,
            imagen,
            disponible,
            orden,
            categoria->{
              _id,
              nombre,
              descripcion,
              orden
            }
          }`
        )
        setEmpanadas(empanadasData)

        const promocionesData = await client.fetch<Promocion[]>(
          `*[_type == "promocion" && activa == true] | order(destacada desc, orden asc) {
            _id,
            nombre,
            descripcion,
            precio,
            cantidadTotal,
            tipo,
            imagen,
            activa,
            destacada,
            orden,
            gustosPredeterminados[]{
              cantidad,
              empanada->{
                _id,
                nombre,
                precio,
                imagen
              }
            }
          }`
        )
        setPromociones(promocionesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  if (!config?.activo) {
    return (
      <div className="closed-container">
        <div className="card closed-card">
          <h2>😴 Estamos cerrados</h2>
          <p>{config?.mensajeCerrado || 'Volvemos pronto!'}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {showSplash && (
        <div className="splash-screen">
          <img src={log} alt="Empanadas La Juana" className="splash-logo" />
          <p className="splash-text">Bienvenidos</p>
          <div className="splash-loader"></div>
        </div>
      )}
      
      <header className="header">
        <div className="container">
          <div className="header-logo-container">
            <img src={log} alt="Empanadas La Juana" className="header-logo" />
          </div>
          {config?.mensajeBienvenida && (
            <p className="header-subtitle">{config.mensajeBienvenida}</p>
          )}
          {config?.horarioAtencion && (
            <p className="header-hours">⏰ {config.horarioAtencion}</p>
          )}
        </div>
      </header>

      <main className="container main-content">
        {promociones.filter(p => p.destacada).length > 0 && (
          <section className="section">
            <h2 className="section-title">🎉 Promociones</h2>
            <div className="grid">
              {promociones
                .filter(p => p.destacada)
                .map(promo => (
                  <div key={promo._id} className="card promo-card">
                    <div>
                      <h3>{promo.nombre}</h3>
                      <p>{promo.descripcion}</p>
                      <p className="promo-price">${promo.precio}</p>
                    </div>
                    <button 
                      className="btn-primary" 
                      onClick={() => handleAddPromocion(promo)}
                    >
                      Agregar
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}

        <section className="section">
          <h2 className="section-title">🥟 Nuestras Empanadas</h2>
          <div className="grid">
            {empanadas.map(empanada => (
              <div key={empanada._id} className="card empanada-card">
                <div className="empanada-info">
                  <h3>{empanada.nombre}</h3>
                  {empanada.descripcion && (
                    <p>{empanada.descripcion}</p>
                  )}
                  <p className="empanada-price">${empanada.precio}</p>
                </div>
                <button className="btn-primary" onClick={() => handleAddItem(empanada)}>
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>Total: ${getTotal()}</p>
            <p>{getTotalItems()} items</p>
          </div>
          <button className="btn-primary" onClick={() => setIsCartOpen(true)}>
            Ver Pedido
          </button>
        </div>
      </div>
      
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} config={config} />
      
      {selectedPromo && (
        <PromoSelectorModal
          promocion={selectedPromo}
          empanadasDisponibles={empanadas}
          onConfirm={handlePromoSelectorConfirm}
          onClose={() => setSelectedPromo(null)}
        />
      )}

      {showToast && (
        <div className="toast">
          <span className="toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default App