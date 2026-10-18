
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { categories , products } from "@/constants/temp/catalogue";
import "../../../app/styles/catalog.css"

export default function CatalogBrowser({
  initialQuery = "",
  initialCategory = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("relevance");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");

    return products
      .filter((product) => {
        const categoryName =
          categories.find((item) => item.id === product.category)?.name ?? "";

        const matchesQuery =
          !normalizedQuery ||
          `${product.name} ${categoryName}`
            .toLocaleLowerCase("fr")
            .includes(normalizedQuery);

        const matchesCategory =
          !category || product.category === category;

        const matchesPrice = product.price <= maxPrice;
        const matchesStock = !inStockOnly || product.stock > 0;

        return (
          matchesQuery &&
          matchesCategory &&
          matchesPrice &&
          matchesStock
        );
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [query, category, maxPrice, inStockOnly, sort]);

  function resetFilters() {
    setQuery("");
    setCategory("");
    setMaxPrice(5000);
    setInStockOnly(false);
    setSort("relevance");
  }

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="catalog-eyebrow">Découvrez Stockit</p>
          <h1>Catalogue de produits</h1>
          <p className="catalog-subtitle">
            Retrouvez vos produits préférés parmi nos différentes catégories.
          </p>
        </div>
      </div>

      <div className="catalog-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un produit, une catégorie..."
          aria-label="Rechercher des produits"
        />
        {query && (
          <button
            type="button"
            className="catalog-clear"
            onClick={() => setQuery("")}
          >
            Effacer
          </button>
        )}
      </div>

      {!initialCategory && (
        <div className="catalog-categories">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`catalog-category ${
                category === item.id ? "is-active" : ""
              }`}
              onClick={() =>
                setCategory(category === item.id ? "" : item.id)
              }
              aria-pressed={category === item.id}
            >
              <span className="catalog-category-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="catalog-layout">
        <aside className="catalog-filters">
          <div className="catalog-filter-heading">
            <h2>Filtres</h2>
            <button type="button" onClick={resetFilters}>
              Réinitialiser
            </button>
          </div>

          <label className="catalog-label" htmlFor="catalog-category">
            Catégorie
          </label>
          <select
            id="catalog-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <label className="catalog-label" htmlFor="catalog-price">
            Prix maximum : {maxPrice.toLocaleString("fr-FR")} DH
          </label>
          <input
            id="catalog-price"
            className="catalog-range"
            type="range"
            min="50"
            max="5000"
            step="50"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />

          <label className="catalog-stock-filter">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
            />
            Produits disponibles uniquement
          </label>
        </aside>

        <div className="catalog-results">
          <div className="catalog-results-toolbar">
            <p>
              <strong>{results.length}</strong>{" "}
              {results.length > 1 ? "produits trouvés" : "produit trouvé"}
            </p>

            <label className="catalog-sort">
              Trier par
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Trier les produits"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </label>
          </div>

          {results.length > 0 ? (
            <div className="catalog-grid">
              {results.map((product) => (
                <article className="catalog-product" key={product.id}>
                  <div className="catalog-product-visual">
                    {product.badge && (
                      <span className="catalog-product-badge">
                        {product.badge}
                      </span>
                    )}
                    <span aria-hidden="true">{product.image}</span>
                  </div>

                  <div className="catalog-product-content">
                    <p className="catalog-product-category">
                      {categories.find(
                        (item) => item.id === product.category
                      )?.name}
                    </p>

                    <h3>{product.name}</h3>

                    <p className="catalog-rating">
                      <span aria-hidden="true">★</span> {product.rating}
                      <span className="catalog-review-count">
                        ({product.reviewCount} avis)
                      </span>
                    </p>

                    <div className="catalog-prices">
                      <strong>
                        {product.price.toLocaleString("fr-FR")} DH
                      </strong>
                      {product.oldPrice && (
                        <del>
                          {product.oldPrice.toLocaleString("fr-FR")} DH
                        </del>
                      )}
                    </div>

                    <p
                      className={
                        product.stock > 0
                          ? "catalog-availability"
                          : "catalog-unavailable"
                      }
                    >
                      {product.stock > 0
                        ? "En stock"
                        : "Indisponible"}
                    </p>

                    <Link
                      className="catalog-product-link"
                      href={`/produits/${product.slug}`}
                    >
                      Voir le produit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <span aria-hidden="true">⌕</span>
              <h2>Aucun produit trouvé</h2>
              <p>Essayez un autre terme ou modifiez vos filtres.</p>
              <button type="button" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
