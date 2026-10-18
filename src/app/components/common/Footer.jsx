
import Link from "next/link";

const shopLinks = [
  { label: "Accueil", href: "/" },
  { label: "Tous les produits", href: "/recherche" },
  { label: "Catégories", href: "/categories" },
  { label: "Marques", href: "/marques" },
];

const customerLinks = [
  { label: "Centre d'aide", href: "/aide" },
  { label: "Contactez-nous", href: "/contact" },
  { label: "Livraison", href: "/livraison" },
  { label: "Retours et remboursements", href: "/retours" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Conditions générales de vente", href: "/conditions-generales" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="stockit-footer">
      <div className="stockit-footer__main">
        <div className="stockit-footer__container">
          <div className="stockit-footer__brand">
            <Link
              href="/"
              className="stockit-footer__logo"
              aria-label="Stockit - Accueil"
            >
              <span className="stockit-footer__logo-mark">S</span>
              <span>stockit</span>
            </Link>

            <p className="stockit-footer__description">
              Découvrez une nouvelle façon de faire vos achats.
              Retrouvez vos produits préférés au même endroit,
              simplement et en toute confiance.
            </p>

            <div className="stockit-footer__trust">
              <span className="stockit-footer__trust-icon">
                ✓
              </span>
              <span>Une expérience d'achat simple et pratique</span>
            </div>
          </div>

          <nav
            className="stockit-footer__column"
            aria-label="Navigation boutique"
          >
            <h3>Notre boutique</h3>
            <ul>
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="stockit-footer__column"
            aria-label="Service client"
          >
            <h3>Besoin d'aide ?</h3>
            <ul>
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="stockit-footer__column"
            aria-label="Informations légales"
          >
            <h3>Informations</h3>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="stockit-footer__bottom">
        <div className="stockit-footer__bottom-inner">
          <p>
            © {currentYear} <strong>Stockit</strong>.
            Tous droits réservés.
          </p>

          <p className="stockit-footer__made-for">
            Pensé pour simplifier vos achats.
          </p>
        </div>
      </div>
    </footer>
  );
}
