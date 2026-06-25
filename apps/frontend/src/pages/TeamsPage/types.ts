export type Division = {
  divisionId: number;
  divisionName: string;
  divisionSlug: string;
  divisionSortOrder: number;
};

export type Team = {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  totalPoints: number;
  overallRating: number | null;
};
