
"use client";

import { useMemo, useState } from "react";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import PeoplesIcon from "@rsuite/icons/Peoples";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import ArrowRightIcon from "@rsuite/icons/ArrowRight";
import { useRouter } from "next/navigation";
import '../../styles/searchHeader.css';
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "T-shirt basique homme",
    slug: "t-shirt-basique-homme",
    image: "/images/products/tshirt.jpg",
    price: 129,
    oldPrice: 159,
    brand: "Basic Wear",
    category: "Vêtements homme",
  },
  {
    id: "2",
    name: "Sac à main élégant",
    slug: "sac-a-main-elegant",
    image: "/images/products/bag.jpg",
    price: 349,
    brand: "Urban Style",
    category: "Mode femme",
  },
  {
    id: "3",
    name: "Chaussures sport",
    slug: "chaussures-sport",
    image: "/images/products/shoes.jpg",
    price: 499,
    oldPrice: 599,
    brand: "Sport Plus",
    category: "Sport",
  },
  {
    id: "4",
    name: "Casque audio Bluetooth",
    slug: "casque-audio-bluetooth",
    image: "/images/products/headphones.jpg",
    price: 279,
    brand: "TechZone",
    category: "Électronique",
  },
  {
    id: "5",
    name: "Montre classique",
    slug: "montre-classique",
    image: "/images/products/watch.jpg",
    price: 599,
    brand: "Time Collection",
    category: "Accessoires",
  },
];

const brands = [
  { id: "1", name: "Basic Wear", slug: "basic-wear" },
  { id: "2", name: "Urban Style", slug: "urban-style" },
  { id: "3", name: "Sport Plus", slug: "sport-plus" },
  { id: "4", name: "TechZone", slug: "techzone" },
  { id: "5", name: "Time Collection", slug: "time-collection" },
];

const categories = [
  { label: "Vêtements femme", slug: "vetements-femme" },
  { label: "Vêtements homme", slug: "vetements-homme" },
  { label: "Grandes tailles", slug: "grandes-tailles" },
  { label: "Chaussures", slug: "chaussures" },
  { label: "Électronique", slug: "electronique" },
  { label: "Maison et décoration", slug: "maison-decoration" },
  { label: "Sport et loisirs", slug: "sport-loisirs" },
];

const normalize = (value) =>
  value
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function SearchHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isOpen = isFocused && query.trim().length > 0;

  const results = useMemo(() => {
    const term = normalize(query);

    if (!term) {
      return {
        suggestions: [],
        brands: [],
        products: [],
      };
    }

    const matchingCategories = categories
      .filter((category) =>
        normalize(category.label).includes(term)
      )
      .slice(0, 7);

    const matchingBrands = brands
      .filter((brand) =>
        normalize(brand.name).includes(term)
      )
      .slice(0, 5);

    const matchingProducts = products
      .filter((product) =>
        normalize(
          `${product.name} ${product.brand} ${product.category}`
        ).includes(term)
      )
      .slice(0, 5);

    return {
      suggestions: matchingCategories.map((category) => ({
        label: category.label,
        slug: category.slug,
        type: "category",
      })),
      brands: matchingBrands,
      products: matchingProducts,
    };
  }, [query]);

  const goToSearch = (value = query) => {
    const term = value.trim();

    if (!term) return;

    setIsFocused(false);

    router.push(
      `/recherche?q=${encodeURIComponent(term)}`
    );
  };

  const closeSearch = () => {
    setQuery("");
    setIsFocused(false);
  };

  return (
    <>
      <header className="stockit-header">
        <div className="stockit-header__inner">
          <button
            className="stockit-logo"
            onClick={() => router.push("/")}
            aria-label="Accueil Stockit"
          >
            <span className="stockit-logo__mark">S</span>
            <span>stockit</span>
          </button>

          <form
            className="stockit-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              goToSearch();
            }}
          >
            <SearchIcon
              size={21}
              className="stockit-search__icon"
              aria-hidden="true"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeSearch();
              }}
              placeholder="Rechercher un produit, une marque, une catégorie..."
              aria-label="Rechercher un produit, une marque ou une catégorie"
              aria-expanded={isOpen}
              aria-controls="stockit-search-panel"
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className="stockit-search__clear"
                onClick={closeSearch}
                aria-label="Effacer la recherche"
              >
                <CloseIcon size={19} />
              </button>
            )}

            <button
              type="submit"
              className="stockit-search__submit"
            >
              Rechercher
            </button>
          </form>

          <nav
            className="stockit-header__actions"
            aria-label="Navigation"
          >
            <Link
              className="stockit-header__action"
              href={"/sign-in"}
            >
              <UserInfoIcon size={24} />
              <span>Mon compte</span>
            </Link>

            <Link
              className="stockit-header__action"
              href={"/panier"}
            >
              <PeoplesIcon size={24} />
              <span>Mon panier</span>
            </Link>
          </nav>
        </div>
      </header>

      {isOpen && (
        <div
          className="stockit-search-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsFocused(false);
            }
          }}
        >
          <section
            id="stockit-search-panel"
            className="stockit-search-panel"
            role="region"
            aria-label="Résultats de recherche"
          >
            <div className="stockit-search-panel__mobile-header">
              <span>Recherche</span>
              <button
                onClick={closeSearch}
                aria-label="Fermer"
              >
                <CloseIcon size={21} />
              </button>
            </div>

            {results.suggestions.length > 0 && (
              <section className="stockit-search-section">
                <h3 className="stockit-search-section__title">
                  Suggestions de recherche
                </h3>

                <ul className="stockit-suggestions">
                  {results.suggestions.map((item) => (
                    <li key={item.slug}>
                      <button
                        className="stockit-suggestion"
                        onClick={() => goToSearch(item.label)}
                      >
                        <SearchIcon size={17} />
                        <span>{item.label}</span>
                        <ArrowRightLineIcon
                          size={17}
                          className="stockit-suggestion__arrow"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {results.brands.length > 0 && (
              <section className="stockit-search-section">
                <div className="stockit-search-section__heading">
                  <h3 className="stockit-search-section__title">
                    Marques
                  </h3>

                  <button
                    className="stockit-view-all"
                    onClick={() =>
                      router.push(
                        `/marques?q=${encodeURIComponent(query)}`
                      )
                    }
                  >
                    Voir tout <ArrowRightIcon size={16} />
                  </button>
                </div>

                <div className="stockit-brands">
                  {results.brands.map((brand) => (
                    <button
                      key={brand.id}
                      className="stockit-brand"
                      onClick={() =>
                        router.push(`/marques/${brand.slug}`)
                      }
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section className="stockit-search-section">
                <div className="stockit-search-section__heading">
                  <h3 className="stockit-search-section__title">
                    Produits
                  </h3>

                  <button
                    className="stockit-view-all"
                    onClick={() => goToSearch()}
                  >
                    Voir tout <ArrowRightIcon size={16} />
                  </button>
                </div>

                <div className="stockit-products">
                  {results.products.map((product) => (
                    <button
                      key={product.id}
                      className="stockit-product"
                      onClick={() =>
                        router.push(`/produits/${product.slug}`)
                      }
                    >
                      <div className="stockit-product__image">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>

                      <span className="stockit-product__name">
                        {product.name}
                      </span>

                      <span className="stockit-product__price">
                        {product.price.toLocaleString("fr-MA")} DH

                        {product.oldPrice && (
                          <del>
                            {product.oldPrice.toLocaleString("fr-MA")} DH
                          </del>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {results.suggestions.length === 0 &&
              results.brands.length === 0 &&
              results.products.length === 0 && (
                <div className="stockit-search-empty">
                  <SearchIcon size={25} />

                  <p>
                    Aucun résultat pour{" "}
                    <strong>« {query} »</strong>
                  </p>

                  <button onClick={() => goToSearch()}>
                    Rechercher tous les résultats
                  </button>
                </div>
              )}

            <button
              className="stockit-search-footer"
              onClick={() => goToSearch()}
            >
              Voir tous les résultats pour « {query} »
              <ArrowRightIcon size={17} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
