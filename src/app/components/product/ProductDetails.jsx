
"use client";

import { useState } from "react";
import Link from "next/link";
import "../../../app/styles/product.css"

export default function ProductDetails({ product, categoryName }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const available = product.stock > 0;
  const images = product.images?.length
    ? product.images
    : [product.image || "📦"];

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  const formatPrice = (price) =>
    `${price.toLocaleString("fr-FR")} DH`;

  function changeQuantity(value) {
    setQuantity((current) =>
      Math.min(product.stock, Math.max(1, current + value))
    );
    setAdded(false);
  }

  function handleAddToCart() {
    if (!available) return;

    // À connecter au service/context du panier existant.
    // Ne pas simuler une commande réellement enregistrée.
    window.dispatchEvent(
      new CustomEvent("stockit:add-to-cart", {
        detail: {
          productId: product.id,
          quantity,
        },
      })
    );

    setAdded(true);
  }

  return (
    <main className="product-page">
      <nav className="product-breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span>/</span>
        <Link href="/categories">Catégories</Link>
        <span>/</span>
        <span>{categoryName}</span>
        <span>/</span>
        <span className="product-breadcrumb-current">
          {product.name}
        </span>
      </nav>

      <section className="product-main">
        <div className="product-gallery">
          <div className="product-image-main">
            {discount > 0 && (
              <span className="product-discount">-{discount}%</span>
            )}

            <div className="product-image-placeholder">
              <span aria-hidden="true">{images[activeImage]}</span>
            </div>

            <span className="product-image-counter">
              {activeImage + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-thumbnail ${
                    activeImage === index ? "is-active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Afficher l’image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <span aria-hidden="true">{image}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-information">
          <p className="product-category-label">{categoryName}</p>

          <h1>{product.name}</h1>

          <div className="product-rating-row">
            <span className="product-stars" aria-label={`Note de ${product.rating} sur 5`}>
              ★★★★★
            </span>
            <strong>{product.rating}</strong>
            <span>({product.reviewCount} avis)</span>
          </div>

          <p className="product-reference">
            Référence : <strong>{product.reference || product.slug}</strong>
          </p>

          <div className="product-price-block">
            <div className="product-price-line">
              <strong className="product-current-price">
                {formatPrice(product.price)}
              </strong>

              {product.oldPrice > product.price && (
                <del className="product-old-price">
                  {formatPrice(product.oldPrice)}
                </del>
              )}
            </div>

            {discount > 0 && (
              <p className="product-saving">
                Vous économisez{" "}
                {formatPrice(product.oldPrice - product.price)}
              </p>
            )}

            <p className="product-tax-note">
              Prix affiché en dirhams marocains (DH).
            </p>
          </div>

          <p className="product-description">
            {product.description ||
              `Découvrez ${product.name}, sélectionné pour répondre à vos besoins au quotidien.`}
          </p>

          <div className={`product-stock ${available ? "in-stock" : "out-stock"}`}>
            <span className="product-stock-dot" />
            {available
              ? `En stock${product.stock <= 5 ? ` — plus que ${product.stock} disponibles` : ""}`
              : "Actuellement indisponible"}
          </div>

          {available && (
            <>
              <div className="product-purchase-row">
                <div className="product-quantity">
                  <button
                    type="button"
                    onClick={() => changeQuantity(-1)}
                    disabled={quantity <= 1}
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>

                  <span aria-live="polite">{quantity}</span>

                  <button
                    type="button"
                    onClick={() => changeQuantity(1)}
                    disabled={quantity >= product.stock}
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="product-add-button"
                  onClick={handleAddToCart}
                >
                  {added ? "Ajout demandé ✓" : "Ajouter au panier"}
                </button>
              </div>

              {added && (
                <p className="product-cart-feedback" role="status">
                  Demande d’ajout envoyée. Le bouton doit être relié à ton
                  gestionnaire de panier pour enregistrer réellement le produit.
                </p>
              )}

              <p className="product-subtotal">
                Sous-total :{" "}
                <strong>{formatPrice(product.price * quantity)}</strong>
              </p>
            </>
          )}

          <div className="product-benefits">
            <div className="product-benefit">
              <span aria-hidden="true">🚚</span>
              <div>
                <strong>Livraison</strong>
                <p>Conditions affichées à la commande</p>
              </div>
            </div>

            <div className="product-benefit">
              <span aria-hidden="true">🔒</span>
              <div>
                <strong>Achat sécurisé</strong>
                <p>Commande via votre espace Stockit</p>
              </div>
            </div>

            <div className="product-benefit">
              <span aria-hidden="true">↩</span>
              <div>
                <strong>Retours</strong>
                <p>Selon les conditions de retour du vendeur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description-section">
        <h2>Description du produit</h2>
        <p>
          {product.description ||
            `${product.name} : consultez les caractéristiques et les conditions de disponibilité avant votre achat.`}
        </p>

        <div className="product-specifications">
          <div>
            <span>Catégorie</span>
            <strong>{categoryName}</strong>
          </div>
          <div>
            <span>Référence</span>
            <strong>{product.reference || product.slug}</strong>
          </div>
          <div>
            <span>Disponibilité</span>
            <strong>{available ? "En stock" : "Indisponible"}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
