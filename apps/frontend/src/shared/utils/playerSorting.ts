export type PlayerPosition = "PG" | "SG" | "G" | "F" | "SF" | "PF" | "C";

export type SortDirection = "asc" | "desc";

export const positionSortRank: Record<PlayerPosition, number> = {
  PG: 0,
  SG: 1,
  G: 2,
  F: 3,
  SF: 4,
  PF: 5,
  C: 6
};

export function comparePlayerPositions(
  firstPosition: PlayerPosition,
  secondPosition: PlayerPosition
) {
  return positionSortRank[firstPosition] - positionSortRank[secondPosition];
}

export function comparePlayersByPositionThenName<
  Player extends { name: string; position: PlayerPosition }
>(firstPlayer: Player, secondPlayer: Player) {
  const positionComparison = comparePlayerPositions(firstPlayer.position, secondPlayer.position);

  if (positionComparison !== 0) {
    return positionComparison;
  }

  return firstPlayer.name.localeCompare(secondPlayer.name);
}

export function compareSortableValues(firstValue: unknown, secondValue: unknown) {
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue));
}
