import { PlayerPosition } from "@prisma/client";

export const PLAYER_POSITION_ORDER: readonly PlayerPosition[] = [
  PlayerPosition.PG,
  PlayerPosition.SG,
  PlayerPosition.G,
  PlayerPosition.SF,
  PlayerPosition.PF,
  PlayerPosition.F,
  PlayerPosition.C
];

export const PLAYER_POSITION_RANK = new Map(
  PLAYER_POSITION_ORDER.map((position, index) => [position, index])
);
