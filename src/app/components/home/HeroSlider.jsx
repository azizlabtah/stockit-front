
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Carousel } from 'rsuite'

const bannerImage =
  'https://ma.jumia.is/cms/000_2026/000010_October/CPR/Tech/MA_W40_Slider_Tech_Day_DM_ONSITE_SliderDesktop_1248x357_FR.gif'

// Données temporaires : à remplacer ensuite par la réponse de Symfony.
const defaultSlides = [
  {
    id: 'tech-day',
    type: 'static',
    title: 'Tech Days',
    image: bannerImage,
    alt: 'Offres Tech Days',
    link: '/promotions/tech-days',
    // price est facultatif
  },

  {
    id: 'product-123',
    type: 'product',
    title: 'Découvrir ce produit',
    image: bannerImage,
    alt: 'Promotion produit',
    productId: 123,
    price: 1299,
    oldPrice: 1599,
  },
]

function getSlideHref(slide) {
  if (slide.type === 'product') {
    return slide.productHref || `/produit/${slide.productId}`
  }

  return slide.link || '#'
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function HeroSlider({
  slides = defaultSlides,
  autoplay = true,
  interval = 5000,
  productBasePath = '/produit',
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  const validSlides = slides.filter(
    (slide) =>
      slide &&
      slide.image &&
      (slide.type === 'static' || slide.type === 'product') &&
      (slide.type !== 'product' || slide.productId != null)
  )

  if (validSlides.length === 0) {
    return null
  }

  const resolveHref = (slide) => {
    if (slide.type === 'product') {
      return (
        slide.productHref ||
        `${productBasePath}/${encodeURIComponent(String(slide.productId))}`
      )
    }

    return slide.link || '#'
  }

  return (
    <section className="hero-slider" style={{ marginTop: '5px' }} aria-label="Offres et promotions">
      <Carousel
        autoplay={autoplay && validSlides.length > 1}
        interval={interval}
        shape="bar"
        placement="bottom"
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        className="hero-slider__carousel"
      >
        
        {validSlides.map((slide) => {
          const href = resolveHref(slide)
          const hasPrice = slide.price != null && slide.price !== ''
          const hasOldPrice =
            hasPrice && slide.oldPrice != null && slide.oldPrice !== ''

          const content = (
            <>
              <img
                className="hero-slider__image"
                src={slide.image}
                alt={slide.alt || slide.title || 'Bannière Stockit'}
                loading="eager"
              />

              {(slide.title || hasPrice) && (
                <div className="hero-slider__overlay">
                  {slide.title && (
                    <span className="hero-slider__title">{slide.title}</span>
                  )}

                  {hasPrice && (
                    <div className="hero-slider__price">
                      {hasOldPrice && (
                        <span className="hero-slider__old-price">
                          {formatPrice(Number(slide.oldPrice))}
                        </span>
                      )}
                      <strong>{formatPrice(Number(slide.price))}</strong>
                    </div>
                  )}
                </div>
              )}
            </>
          )

          return (
            <div className="hero-slider__slide" key={slide.id}>
              {href === '#' ? (
                <div className="hero-slider__link" aria-label={slide.alt}>
                  {content}
                </div>
              ) : (
                <Link
                  href={href}
                  className="hero-slider__link"
                  aria-label={
                    slide.title ||
                    (slide.type === 'product'
                      ? 'Voir le produit'
                      : 'Découvrir la promotion')
                  }
                >
                  {content}
                </Link>
              )}
            </div>
          )
        })}
      </Carousel>
    </section>
  )
}
