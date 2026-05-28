import {
  Box,
  Group,
  NumberInput,
  Select,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title
} from "@mantine/core";
import { Shield } from "lucide-react";
import { useState } from "react";

export type ProfileRatings = {
  defense: number;
  offense: number;
  consistency: number;
  cohesion: number;
  depth: number;
};

export type TeamEditorValues = {
  name: string;
  division: string;
  logoUrl: string;
  primaryColor: string;
  overallRating: number;
  description: string;
  profileRatings: ProfileRatings;
};

type TeamEditorFormProps = {
  initialValues: TeamEditorValues;
};

const divisionOptions = ["Division A", "Division B", "Division C", "Division D"];
const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;

const profileRatingFields = [
  { key: "defense", label: "Defense" },
  { key: "offense", label: "Offense" },
  { key: "consistency", label: "Consistency" },
  { key: "cohesion", label: "Cohesion" },
  { key: "depth", label: "Depth" }
] as const;

type ProfileRatingKey = (typeof profileRatingFields)[number]["key"];

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || "NT";
}

function getStars(rating: number) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

export function TeamEditorForm({ initialValues }: TeamEditorFormProps) {
  const [teamName, setTeamName] = useState(initialValues.name);
  const [division, setDivision] = useState<string | null>(initialValues.division);
  const [logoUrl, setLogoUrl] = useState(initialValues.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(initialValues.primaryColor);
  const [overallRating, setOverallRating] = useState(initialValues.overallRating);
  const [teamDescription, setTeamDescription] = useState(initialValues.description);
  const [profileRatings, setProfileRatings] = useState<Record<ProfileRatingKey, number>>(
    initialValues.profileRatings
  );

  const previewName = teamName.trim() || "New Team";
  const isPrimaryColorValid = hexColorPattern.test(primaryColor);

  function updateProfileRating(key: ProfileRatingKey, value: number) {
    setProfileRatings((currentRatings) => ({
      ...currentRatings,
      [key]: value
    }));
  }

  return (
    <>
      <Box className="manage-team-section">
        <Title order={2}>Team Basic Info</Title>

        <Box className="team-basic-info-layout">
          <Stack gap="md">
            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              label="Team Name"
              onChange={(event) => setTeamName(event.currentTarget.value)}
              placeholder="New Team"
              value={teamName}
            />

            <Select
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              data={divisionOptions}
              label="Division"
              onChange={setDivision}
              value={division}
            />

            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              label="Logo Path"
              onChange={(event) => setLogoUrl(event.currentTarget.value)}
              placeholder="/logos/falcon-united.svg"
              value={logoUrl}
            />

            <Box>
              <TextInput
                classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
                error={
                  isPrimaryColorValid
                    ? undefined
                    : "Enter a valid hex color, e.g. #3B82F6"
                }
                label="Primary Color *"
                onChange={(event) => setPrimaryColor(event.currentTarget.value)}
                placeholder="#3B82F6"
                value={primaryColor}
              />
              <Group className="primary-color-preview-row" gap="sm">
                <Box
                  aria-label="Primary color preview"
                  className="primary-color-swatch"
                  style={{ backgroundColor: isPrimaryColorValid ? primaryColor : undefined }}
                />
                <Text className="primary-color-preview-text">
                  {isPrimaryColorValid ? primaryColor.toUpperCase() : "Neutral preview"}
                </Text>
              </Group>
            </Box>

            <NumberInput
              allowDecimal
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              clampBehavior="strict"
              decimalScale={1}
              label="Overall Rating"
              max={5}
              min={0}
              onChange={(value) => {
                setOverallRating(typeof value === "number" ? value : Number(value) || 0);
              }}
              step={0.5}
              value={overallRating}
            />

            <Textarea
              autosize
              classNames={{ input: "manage-team-textarea", label: "manage-team-input-label" }}
              label="Team Description"
              maxRows={5}
              minRows={4}
              onChange={(event) => setTeamDescription(event.currentTarget.value)}
              placeholder="A fast-paced squad built around transition scoring and disciplined half-court spacing."
              value={teamDescription}
            />
          </Stack>

          <Stack className="team-basic-info-preview" gap="lg">
            <Box>
              <Text className="data-label">Logo Preview</Text>
              {logoUrl ? (
                <img alt="" className="manage-team-logo-preview" src={logoUrl} />
              ) : (
                <Box aria-hidden="true" className="manage-team-logo-preview manage-team-logo-fallback">
                  <Shield size={30} />
                  <span>{getInitials(previewName)}</span>
                </Box>
              )}
            </Box>

            <Box>
              <Text className="data-label">Team Preview</Text>
              <Text className="manage-team-preview-value">{previewName}</Text>
            </Box>

            <Box>
              <Text className="data-label">Rating Preview</Text>
              <Text className="manage-team-rating-preview">{getStars(overallRating)}</Text>
            </Box>

            <Box>
              <Text className="data-label">Selected Division</Text>
              <Text className="manage-team-preview-value">{division}</Text>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box className="manage-team-section">
        <Title order={2}>Team Profile Ratings</Title>
        <Stack className="profile-rating-list" gap="md">
          {profileRatingFields.map((field) => (
            <Box className="profile-rating-row" key={field.key}>
              <Text className="profile-rating-label">{field.label}</Text>
              <Slider
                classNames={{
                  bar: "profile-rating-slider-bar",
                  mark: "profile-rating-slider-mark",
                  root: "profile-rating-slider",
                  thumb: "profile-rating-slider-thumb",
                  track: "profile-rating-slider-track"
                }}
                label={(value) => value.toFixed(1)}
                max={10}
                min={1}
                onChange={(value) => updateProfileRating(field.key, value)}
                step={0.5}
                value={profileRatings[field.key]}
              />
              <Text className="profile-rating-value">
                {profileRatings[field.key].toFixed(1)}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
}
