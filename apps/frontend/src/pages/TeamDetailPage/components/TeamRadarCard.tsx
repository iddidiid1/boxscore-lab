import { Box, Text, Title } from "@mantine/core";

export type TeamRadarAttribute = {
  label: string;
  value: number;
};

type TeamRadarCardProps = {
  attributes: TeamRadarAttribute[] | null;
};

const center = 150;
const maxRadius = 110;
const labelRadius = 135;
const gridLevels = [2, 4, 6, 8, 10];
const labelInset = 38;

function clampRating(value: number) {
  return Math.max(1, Math.min(10, value));
}

function getPoint(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;

  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius
  };
}

function getPolygonPoints(attributes: TeamRadarAttribute[]) {
  return attributes
    .map((attribute, index) => {
      const radius = (clampRating(attribute.value) / 10) * maxRadius;
      const point = getPoint(index, attributes.length, radius);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function getLabelAnchor(x: number) {
  if (x < center - 12) {
    return "end";
  }

  if (x > center + 12) {
    return "start";
  }

  return "middle";
}

function getLabelPoint(index: number, total: number) {
  const point = getPoint(index, total, labelRadius);
  const anchor = getLabelAnchor(point.x);

  if (anchor === "end") {
    return { ...point, x: Math.max(point.x, labelInset) };
  }

  if (anchor === "start") {
    return { ...point, x: Math.min(point.x, 300 - labelInset) };
  }

  return {
    ...point,
    y: point.y < center ? Math.max(point.y, 16) : Math.min(point.y, 284)
  };
}

export function TeamRadarCard({ attributes }: TeamRadarCardProps) {
  return (
    <Box className="team-radar-card app-panel">
      <Title className="team-radar-title" order={2}>
        Team Profile
      </Title>
      {attributes === null ? (
        <Text className="module-copy">No profile ratings recorded.</Text>
      ) : (
      <Box className="team-radar-chart">
        <svg aria-label="Team radar profile chart" role="img" viewBox="0 0 300 300">
          <defs>
            <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="3" />
              <feColorMatrix
                in="blur"
                result="glow"
                type="matrix"
                values="0 0 0 0 0.305 0 0 0 0 0.871 0 0 0 0 0.639 0 0 0 0.42 0"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {gridLevels.map((level) => {
            const radius = (level / 10) * maxRadius;

            return (
              <polygon
                className="radar-guide"
                key={level}
                points={attributes
                  .map((_, index) => {
                    const point = getPoint(index, attributes.length, radius);
                    return `${point.x},${point.y}`;
                  })
                  .join(" ")}
              />
            );
          })}

          {attributes.map((_, index) => {
            const point = getPoint(index, attributes.length, maxRadius);
            return (
              <line
                className="radar-axis"
                key={index}
                x1={center}
                x2={point.x}
                y1={center}
                y2={point.y}
              />
            );
          })}

          <polygon className="radar-value" points={getPolygonPoints(attributes)} />

          {attributes.map((attribute, index) => {
            const point = getLabelPoint(index, attributes.length);
            const clampedValue = clampRating(attribute.value);

            return (
              <text
                className="radar-label"
                dominantBaseline="middle"
                key={attribute.label}
                textAnchor={getLabelAnchor(point.x)}
                x={point.x}
                y={point.y}
              >
                <tspan>{attribute.label}</tspan>
                <tspan className="radar-label-value"> {clampedValue.toFixed(1)}</tspan>
              </text>
            );
          })}
        </svg>
      </Box>
      )}
    </Box>
  );
}
