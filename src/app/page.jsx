

import CategorySlider from './components/home/CategorySlider'
import HeroSlider from './components/home/HeroSlider'
export default function HomePage() {
  return (
    <main className="home-page">
      <div className="home-page__hero">
        <HeroSlider />
      </div>
      <div className="home-page__categories">
        <CategorySlider />
      </div>

      {/* Autres sections de la page d'accueil */}
    </main>
  )
}
