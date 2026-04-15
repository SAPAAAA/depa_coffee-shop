import { useState, type CSSProperties } from "react";
import "./CategoryShelf.css";
import type { MenuDrink } from "@api-types/catalog/drinks/drink.model";

interface CategoryShelfProps {
  maxVisibleItems?: number;
  categoryHeader: {
    name: string;
    position: "left" | "center" | "right";
  };
  items: MenuDrink[];
}

const CategoryShelf = ({
  maxVisibleItems = 5,
  categoryHeader,
  items,
}: Readonly<CategoryShelfProps>) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isAllInView = items.length <= maxVisibleItems;
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= items.length - maxVisibleItems;

  return (
    <section className="category-shelf">
      <h2 className={`category-header text-${categoryHeader.position}`}>
        {categoryHeader.name}
      </h2>
      <div className="carousel">
        <div
          className="carousel-list"
          style={
            {
              "--max-visible": maxVisibleItems,
              "--current-index": currentIndex,
            } as CSSProperties
          }
        >
          <div
            className="carousel-track"
          >
            {items.map((item) => (
              <div key={item.id} className="carousel-item">
                <img
                  src={item.imageUrl ?? ""}
                  alt={item.name}
                  className="item-image"
                />
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-ctrl-overlay carousel-ctrl-overlay-left">
          <button
            className="carousel-btn"
            disabled={isAllInView || isAtStart}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 2, 0))}
          >
            <span className="carousel-btn-icon carousel-btn-icon-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </span>
          </button>
        </div>
        <div className="carousel-ctrl-overlay carousel-ctrl-overlay-right">
          <button
            className="carousel-btn"
            disabled={isAllInView || isAtEnd}
            onClick={() =>
              setCurrentIndex((prev) =>
                Math.min(prev + 2, items.length - maxVisibleItems),
              )
            }
          >
            <span className="carousel-btn-icon carousel-btn-icon-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShelf;
