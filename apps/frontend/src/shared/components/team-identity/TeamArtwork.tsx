import { useEffect, useState } from "react";

type TeamArtworkProps = {
  className?: string;
  logoUrl?: string | null;
  name: string;
  size?: "compact" | "detail" | "preview";
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || "NT";
}

export function TeamArtwork({
  className,
  logoUrl,
  name,
  size = "compact"
}: TeamArtworkProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const normalizedUrl = logoUrl?.trim() || null;
  const hasFailed = normalizedUrl !== null && failedUrl === normalizedUrl;
  const classes = ["app-team-artwork", className].filter(Boolean).join(" ");

  useEffect(() => {
    if (failedUrl !== null && failedUrl !== normalizedUrl) {
      setFailedUrl(null);
    }
  }, [failedUrl, normalizedUrl]);

  return (
    <span className={classes} data-size={size}>
      {normalizedUrl !== null && !hasFailed ? (
        <img
          alt=""
          className="app-team-artwork__image"
          onError={() => setFailedUrl(normalizedUrl)}
          src={normalizedUrl}
        />
      ) : (
        <span aria-hidden="true" className="app-team-artwork__fallback">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
