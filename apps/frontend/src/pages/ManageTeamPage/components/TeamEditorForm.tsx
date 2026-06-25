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
import type { Division, ProfileRating } from "../../../features/teams";

export type TeamEditorValues = {
  name: string;
  divisionId: number | null;
  logoUrl: string;
  primaryColor: string;
  overallRating: number;
  description: string;
  profileRating: ProfileRating;
};

type TeamEditorFormProps = {
  value: TeamEditorValues;
  onChange: (value: TeamEditorValues) => void;
  divisions: Division[];
  errors?: Record<string, string>;
  disabled?: boolean;
};

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
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating / 2)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

export function TeamEditorForm({
  value,
  onChange,
  divisions,
  errors = {},
  disabled = false
}: TeamEditorFormProps) {
  const previewName = value.name.trim() || "New Team";
  const isPrimaryColorValid = value.primaryColor.trim().length === 0 || hexColorPattern.test(value.primaryColor);
  const divisionOptions = divisions.map((division) => ({
    value: String(division.id),
    label: division.name
  }));

  function update(partial: Partial<TeamEditorValues>) {
    onChange({ ...value, ...partial });
  }

  function updateProfileRating(key: ProfileRatingKey, nextValue: number) {
    update({
      profileRating: {
        ...value.profileRating,
        [key]: nextValue
      }
    });
  }

  return (
    <>
      <Box className="manage-team-section">
        <Title order={2}>Team Basic Info</Title>

        <Box className="team-basic-info-layout">
          <Stack gap="md">
            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              disabled={disabled}
              error={errors.name}
              label="Team Name"
              onChange={(event) => update({ name: event.currentTarget.value })}
              placeholder="New Team"
              value={value.name}
            />

            <Select
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              data={divisionOptions}
              disabled={disabled}
              error={errors.divisionId}
              label="Division"
              onChange={(nextValue) => update({ divisionId: nextValue ? Number(nextValue) : null })}
              value={value.divisionId === null ? null : String(value.divisionId)}
            />

            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              disabled={disabled}
              error={errors.logoUrl}
              label="Logo URL"
              onChange={(event) => update({ logoUrl: event.currentTarget.value })}
              placeholder="https://example.com/logo.png"
              value={value.logoUrl}
            />

            <Box>
              <TextInput
                classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
                disabled={disabled}
                error={errors.primaryColor ?? (isPrimaryColorValid ? undefined : "Enter a valid hex color, e.g. #3B82F6")}
                label="Primary Color"
                onChange={(event) => update({ primaryColor: event.currentTarget.value })}
                placeholder="#3B82F6"
                value={value.primaryColor}
              />
              <Group className="primary-color-preview-row" gap="sm">
                <Box
                  aria-label="Primary color preview"
                  className="primary-color-swatch"
                  style={{ backgroundColor: isPrimaryColorValid && value.primaryColor ? value.primaryColor : undefined }}
                />
                <Text className="primary-color-preview-text">
                  {isPrimaryColorValid && value.primaryColor ? value.primaryColor.toUpperCase() : "Neutral preview"}
                </Text>
              </Group>
            </Box>

            <NumberInput
              allowDecimal
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              clampBehavior="strict"
              decimalScale={1}
              disabled={disabled}
              error={errors.overallRating}
              label="Overall Rating"
              max={10}
              min={0}
              onChange={(nextValue) => {
                update({ overallRating: typeof nextValue === "number" ? nextValue : Number(nextValue) || 0 });
              }}
              step={0.5}
              value={value.overallRating}
            />

            <Textarea
              autosize
              classNames={{ input: "manage-team-textarea", label: "manage-team-input-label" }}
              disabled={disabled}
              error={errors.description}
              label="Team Description"
              maxRows={5}
              minRows={4}
              onChange={(event) => update({ description: event.currentTarget.value })}
              placeholder="A fast-paced squad built around transition scoring and disciplined half-court spacing."
              value={value.description}
            />
          </Stack>

          <Stack className="team-basic-info-preview" gap="lg">
            <Box>
              <Text className="data-label">Logo Preview</Text>
              {value.logoUrl ? (
                <img alt="" className="manage-team-logo-preview" src={value.logoUrl} />
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
              <Text className="manage-team-rating-preview">{getStars(value.overallRating)}</Text>
            </Box>

            <Box>
              <Text className="data-label">Selected Division</Text>
              <Text className="manage-team-preview-value">
                {divisions.find((division) => division.id === value.divisionId)?.name ?? "None"}
              </Text>
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
                disabled={disabled}
                label={(nextValue) => nextValue.toFixed(1)}
                max={10}
                min={1}
                onChange={(nextValue) => updateProfileRating(field.key, nextValue)}
                step={0.5}
                value={value.profileRating[field.key]}
              />
              <Text className="profile-rating-value">
                {value.profileRating[field.key].toFixed(1)}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
}
