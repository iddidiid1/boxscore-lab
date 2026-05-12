export type Division = "A" | "B" | "C" | "D";

export type Team = {
  id: string;
  name: string;
  division: Division;
  logoUrl?: string;
  points: number;
  overallRating: number;
};
