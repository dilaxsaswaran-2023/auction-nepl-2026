import { useEffect, useMemo, useState } from "react";

const positions = ["01", "02", "03", "04", "05", "06"];

function shuffle(values) {
  return [...values]
    .map((value) => ({ value, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ value }) => value);
}

export default function CategoryOrderView({ categories, onBack, onBackToPlayers }) {
  const emptyOrder = useMemo(
    () => positions.map((position) => ({ position, category: "" })),
    [],
  );
  const [order, setOrder] = useState(emptyOrder);
  const [previewOrder, setPreviewOrder] = useState(emptyOrder);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedPositions, setRevealedPositions] = useState([]);
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    if (!isShuffling) return undefined;

    const intervalId = window.setInterval(() => {
      const shuffledCategories = shuffle(categories);
      setPreviewOrder(
        positions.map((position, index) => ({
          position,
          category: shuffledCategories[index]?.label || "",
        })),
      );
    }, 90);

    return () => window.clearInterval(intervalId);
  }, [categories, isShuffling]);

  const selectOrder = () => {
    if (isShuffling || isRevealing || hasSelected) return;

    setIsShuffling(true);
    setIsRevealing(false);
    setRevealedPositions([]);
    setOrder(emptyOrder);
    setPreviewOrder(emptyOrder);

    window.setTimeout(() => {
      const shuffledCategories = shuffle(categories);
      const nextOrder = positions.map((position, index) => ({
        position,
        category: shuffledCategories[index]?.label || "",
      }));

      setPreviewOrder(nextOrder);
      setIsShuffling(false);
      setIsRevealing(true);

      nextOrder.forEach((item, index) => {
        window.setTimeout(() => {
          setOrder((current) =>
            current.map((currentItem) =>
              currentItem.position === item.position ? item : currentItem,
            ),
          );
          setRevealedPositions((current) => [...current, item.position]);

          if (index === nextOrder.length - 1) {
            setIsRevealing(false);
            setHasSelected(true);
          }
        }, index * 360);
      });
    }, 900);
  };

  const visibleOrder = isShuffling ? previewOrder : order;
  const isAnimating = isShuffling || isRevealing;

  return (
    <main className="slots-page category-order-page">
      <header className="slots-topbar">
        <div>
          <span>NEPL Season 2026</span>
          <h1>Auction Order</h1>
        </div>
        <div className="slot-actions">
          <button type="button" className="secondary-slot-button" onClick={onBack}>
            Back to Slots
          </button>
          <button type="button" className="slots-back-button" onClick={onBackToPlayers}>
            Back to Players
          </button>
        </div>
      </header>

      <section className="slots-layout category-order-layout">
        <div className="available-teams">
          <header>
            <h2>Categories</h2>
            <span>{categories.length}</span>
          </header>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.label}</li>
            ))}
          </ul>
        </div>

        <div className="slot-board">
          <header>
            <h2>Draw Order</h2>
            <button
              type="button"
              className="assign-button"
              onClick={selectOrder}
              disabled={isAnimating || hasSelected}
            >
              {hasSelected
                ? "Selected"
                : isRevealing
                  ? "Assigning..."
                  : isShuffling
                    ? "Shuffling..."
                    : "Select Order"}
            </button>
          </header>

          <div className={`slot-grid category-order-grid${isAnimating ? " assigning" : ""}`}>
            {visibleOrder.map((item) => (
              <article
                className={`slot-card category-order-card${
                  revealedPositions.includes(item.position) ? " revealed" : ""
                }`}
                key={item.position}
              >
                <span>Order {item.position}</span>
                <strong>{item.category || "Waiting"}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
