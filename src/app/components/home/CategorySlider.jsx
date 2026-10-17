"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftLine, ArrowRightLine } from "@rsuite/icons";
import Loader from "../common/Loader";
import { backendProxyFetch } from "@/services/api/client";

export default function CategorySlider() {
    const sliderRef = useRef(null);

    const [showArrows, setShowArrows] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Récupération des catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await backendProxyFetch(
                    "/no_connection/home/categories"
                );
    
                const result = response.data;
    
                setCategories(
                    result.success && Array.isArray(result.data)
                        ? result.data
                        : []
                );
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCategories();
    }, []);

    // Mise à jour de l'état du slider
    const updateSlider = useCallback(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const hasOverflow =
            slider.scrollWidth > slider.clientWidth + 1;

        setShowArrows(hasOverflow);
        setCanScrollLeft(slider.scrollLeft > 1);
        setCanScrollRight(
            slider.scrollLeft + slider.clientWidth <
                slider.scrollWidth - 1
        );
    }, []);

    // Observer le slider et le chargement des images
    useEffect(() => {
        const slider = sliderRef.current;

        // Le slider n'existe pas encore pendant le chargement
        if (!slider) return;

        updateSlider();

        const resizeObserver = new ResizeObserver(updateSlider);
        resizeObserver.observe(slider);

        const handleScroll = () => updateSlider();

        slider.addEventListener("scroll", handleScroll);

        const images = Array.from(
            slider.querySelectorAll("img")
        );

        Promise.all(
            images.map(
                (img) =>
                    new Promise((resolve) => {
                        if (img.complete) {
                            resolve();
                        } else {
                            img.addEventListener("load", resolve, {
                                once: true,
                            });
                            img.addEventListener("error", resolve, {
                                once: true,
                            });
                        }
                    })
            )
        ).then(updateSlider);

        return () => {
            resizeObserver.disconnect();
            slider.removeEventListener("scroll", handleScroll);
        };
    }, [loading, categories, updateSlider]);

    // Défilement horizontal
    const scroll = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.scrollBy({
            left: direction * slider.clientWidth * 0.8,
            behavior: "smooth",
        });
    };

    // Le return conditionnel vient après tous les hooks
    if (loading) {
        return <Loader />;
    }

    return (
        <section className="categorySection">
            <div className="header">
                <h2 className="title">Nos catégories</h2>
            </div>

            <div className="sliderWrapper">
                {showArrows && (
                    <button
                        type="button"
                        className="arrow left"
                        onClick={() => scroll(-1)}
                        disabled={!canScrollLeft}
                        aria-label="Catégories précédentes"
                    >
                        <ArrowLeftLine />
                    </button>
                )}

                <div
                    ref={sliderRef}
                    className="slider"
                    aria-label="Catégories de produits"
                >
                    {categories?.map((category) => (
                        <a
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="categoryCard"
                        >
                            <div className="imageWrapper">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="image"
                                    loading="lazy"
                                />
                            </div>

                            <h3 className="categoryName">
                                {category.name}
                            </h3>
                        </a>
                    ))}
                </div>

                {showArrows && (
                    <button
                        type="button"
                        className="arrow right"
                        onClick={() => scroll(1)}
                        disabled={!canScrollRight}
                        aria-label="Catégories suivantes"
                    >
                        <ArrowRightLine />
                    </button>
                )}
            </div>
        </section>
    );
}