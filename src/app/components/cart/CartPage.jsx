
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Message, Panel } from 'rsuite'

const initialProducts = [
  {
    id: 1,
    name: 'BCAA + VITAMINE B6 210 CAPSULES - SUPERIOR 14',
    seller: 'Empire Proteinshop',
    oldPrice: 489,
    price: 399,
    quantity: 1,
    delivery: 'Du mercredi 14 au jeudi 15 octobre 2026',
    category: 'Nutrition sportive',
    image: '/images/products/bcaa.jpg',
  },
  {
    id: 2,
    name: 'Téléviseur Samsung QLED 55 pouces – Modèle QA55Q6FAAUXMV',
    seller: 'ElectroElaissi',
    oldPrice: 6500,
    price: 4149,
    quantity: 1,
    delivery: 'Du mardi 13 au mercredi 14 octobre 2026',
    category: 'Télévision',
    image: '/images/products/samsung-qled.jpg',
  },
  {
    id: 3,
    name: 'TAURUS - Friteuse sans Huile - MA9173003A - 9L - 1800W - 12 Programmes',
    seller: 'MARJANEMALL',
    oldPrice: 2599,
    price: 999,
    quantity: 1,
    delivery: 'Du mardi 13 au mercredi 14 octobre 2026',
    category: 'Électroménager',
    image: '/images/products/taurus-air-fryer.jpg',
  },
]

const formatPrice = (amount) =>
  new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' MAD'

export default function CartPage() {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [notice, setNotice] = useState('')

  const totalQuantity = useMemo(
    () => products.reduce((sum, product) => sum + product.quantity, 0),
    [products]
  )

  const subtotal = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ),
    [products]
  )

  const savings = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum + (product.oldPrice - product.price) * product.quantity,
        0
      ),
    [products]
  )

  const updateQuantity = (id, quantity) => {
    setNotice('')
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, quantity) }
          : product
      )
    )
  }

  const removeProduct = (id) => {
    setProducts((current) => current.filter((product) => product.id !== id))
    setNotice('Article supprimé de votre panier.')
  }

  const handleCheckout = () => {
    // À connecter à ton flux de commande / checkout.
    router.push('/commande')
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <div>
            <p className="cart-eyebrow">STOCKIT / ACHATS</p>
            <h1>Mon panier</h1>
            <p className="cart-subtitle">
              Retrouvez vos articles avant de finaliser votre commande.
            </p>
          </div>

          <div className="cart-count">
            <span className="cart-count__number">{totalQuantity}</span>
            <span>{totalQuantity > 1 ? 'articles' : 'article'}</span>
          </div>
        </header>

        {notice && (
          <Message
            type="info"
            closable
            onClose={() => setNotice('')}
            className="cart-notice"
          >
            {notice}
          </Message>
        )}

        {products.length === 0 ? (
          <Panel bordered className="cart-empty">
            <div className="cart-empty__icon" aria-hidden="true">
              🛒
            </div>
            <h2>Votre panier est vide</h2>
            <p>
              Découvrez nos catégories et ajoutez vos produits préférés.
            </p>
            <Button
              appearance="primary"
              onClick={() => router.push('/')}
              className="cart-checkout-button"
            >
              Continuer mes achats
            </Button>
          </Panel>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              <div className="cart-section-heading">
                <h2>Vos articles</h2>
                <span>{totalQuantity} produit(s)</span>
              </div>

              {products.map((product) => (
                <article className="cart-product" key={product.id}>
                  <div className="cart-product__image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                        event.currentTarget.nextElementSibling.style.display =
                          'flex'
                      }}
                    />
                    <div
                      className="cart-product__placeholder"
                      aria-hidden="true"
                    >
                      {product.category}
                    </div>
                  </div>

                  <div className="cart-product__content">
                    <div className="cart-product__top">
                      <div className="cart-product__details">
                        <span className="cart-product__category">
                          {product.category}
                        </span>
                        <h3>{product.name}</h3>
                        <p className="cart-product__seller">
                          Vendu par : <strong>{product.seller}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => removeProduct(product.id)}
                        aria-label={`Supprimer ${product.name}`}
                        title="Supprimer l'article"
                      >
                        ×
                      </button>
                    </div>

                    <div className="cart-delivery">
                      <span className="cart-delivery__icon" aria-hidden="true">
                        ↗
                      </span>
                      <div>
                        <strong>Livraison estimée</strong>
                        <p>{product.delivery}</p>
                      </div>
                    </div>

                    <div className="cart-product__bottom">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity - 1)
                          }
                          disabled={product.quantity <= 1}
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span aria-label={`Quantité : ${product.quantity}`}>
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity + 1)
                          }
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-product__prices">
                        <span className="cart-old-price">
                          {formatPrice(product.oldPrice * product.quantity)}
                        </span>
                        <strong className="cart-current-price">
                          {formatPrice(product.price * product.quantity)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <button
                type="button"
                className="cart-continue"
                onClick={() => router.push('/')}
              >
                <span aria-hidden="true">←</span> Continuer mes achats
              </button>
            </section>

            <aside className="cart-summary">
              <Panel bordered className="cart-summary__panel">
                <h2>Récapitulatif</h2>

                <div className="cart-summary__line">
                  <span>Articles ({totalQuantity})</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <div className="cart-summary__line">
                  <span>Sous-total (hors livraison)</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                {savings > 0 && (
                  <div className="cart-summary__savings">
                    <span>Votre économie</span>
                    <strong>− {formatPrice(savings)}</strong>
                  </div>
                )}

                <p className="cart-summary__delivery">
                  Les frais de livraison seront précisés à l’étape suivante.
                </p>

                <div className="cart-summary__total">
                  <span>Total provisoire</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <Button
                  appearance="primary"
                  block
                  className="cart-checkout-button"
                  onClick={handleCheckout}
                >
                  Valider mon panier <span aria-hidden="true">→</span>
                </Button>

                <p className="cart-summary__secure">
                  <span aria-hidden="true">🔒</span>
                  Commande sécurisée
                </p>
              </Panel>

              <div className="cart-benefits">
                <div className="cart-benefit">
                  <span className="cart-benefit__icon">↩</span>
                  <div>
                    <strong>Satisfait ou remboursé</strong>
                    <p>Selon les conditions de retour applicables.</p>
                  </div>
                </div>

                <div className="cart-benefit">
                  <span className="cart-benefit__icon">✈</span>
                  <div>
                    <strong>Livraison au Maroc</strong>
                    <p>Offre nationale et internationale selon le vendeur.</p>
                  </div>
                </div>

                <div className="cart-benefit">
                  <span className="cart-benefit__icon">✓</span>
                  <div>
                    <strong>Produits authentiques</strong>
                    <p>Consultez les garanties et informations vendeur.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
