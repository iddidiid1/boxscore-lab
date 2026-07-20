import { Star } from "lucide-react";

type FractionalStarRatingProps = {
  className?: string;
  size?: "compact" | "default";
  value: number | null | undefined;
};

function formatRating(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

export function FractionalStarRating({
  className,
  size = "default",
  value
}: FractionalStarRatingProps) {
  const isAvailable = typeof value === "number" && Number.isFinite(value);
  const normalizedValue = isAvailable ? Math.max(0, Math.min(10, value)) : null;
  const displayValue = normalizedValue === null ? "—" : formatRating(normalizedValue);
  const classes = ["app-star-rating", className].filter(Boolean).join(" ");

  return (
    <span
      aria-label={
        normalizedValue === null
          ? "Rating unavailable"
          : `${displayValue} out of 10 rating`
      }
      className={classes}
      data-size={size}
      data-unavailable={normalizedValue === null ? true : undefined}
    >
      <span aria-hidden="true" className="app-star-rating__stars">
        {Array.from({ length: 5 }, (_, index) => {
          const fill =
            normalizedValue === null
              ? 0
              : Math.max(0, Math.min(1, normalizedValue / 2 - index));

          return (
            <span className="app-star-rating__slot" key={index}>
              <Star className="app-star-rating__empty" />
              <span
                className="app-star-rating__fill"
                style={{ width: `${fill * 100}%` }}
              >
                <Star />
              </span>
            </span>
          );
        })}
      </span>
      <span aria-hidden="true" className="app-star-rating__value">
        {displayValue} / 10
      </span>
    </span>
  );
}
