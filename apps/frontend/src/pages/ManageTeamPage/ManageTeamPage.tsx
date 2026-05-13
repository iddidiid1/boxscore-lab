import {
  Box,
  Button,
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
import "./ManageTeamPage.css";

const mockTeam = {
  name: "Falcon United",
  division: "Division A",
  logoUrl: "",
  overallRating: 4,
  description:
    "A fast-paced squad built around transition scoring and disciplined half-court spacing.",
  profileRatings: {
    defense: 8.5,
    offense: 8,
    consistency: 7.5,
    cohesion: 7,
    depth: 8.8
  }
};

const divisionOptions = ["Division A", "Division B", "Division C", "Division D"];

const profileRatingFields = [
  { key: "defense", label: "Defense" },
  { key: "offense", label: "Offense" },
  { key: "consistency", label: "Consistency" },
  { key: "cohesion", label: "Cohesion" },
  { key: "depth", label: "Depth" }
] as const;

type ProfileRatingKey = (typeof profileRatingFields)[number]["key"];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getStars(rating: number) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"\u2605".repeat(roundedRating)}${"\u2606".repeat(5 - roundedRating)}`;
}

export function ManageTeamPage() {
  const [teamName, setTeamName] = useState(mockTeam.name);
  const [division, setDivision] = useState<string | null>(mockTeam.division);
  const [logoUrl, setLogoUrl] = useState(mockTeam.logoUrl);
  const [overallRating, setOverallRating] = useState(mockTeam.overallRating);
  const [teamDescription, setTeamDescription] = useState(mockTeam.description);
  const [profileRatings, setProfileRatings] = useState<Record<ProfileRatingKey, number>>(
    mockTeam.profileRatings
  );

  function updateProfileRating(key: ProfileRatingKey, value: number) {
    setProfileRatings((currentRatings) => ({
      ...currentRatings,
      [key]: value
    }));
  }

  return (
    <Stack className="manage-team-page" gap="lg">
      <Group align="flex-start" className="manage-team-header" justify="space-between">
        <Box>
          <Text className="eyebrow">Team workspace</Text>
          <Title className="page-title" order={1}>
            Manage Team
          </Title>
          <Text className="page-summary" maw={560} mt="xs">
            Update team identity, ratings, and roster settings.
          </Text>
        </Box>

        <Group gap="sm">
          <Button className="manage-team-save-button">Save Changes</Button>
          <Button
            className="manage-team-cancel-button"
            component="a"
            href="/teams/falcon-united"
            variant="outline"
          >
            Cancel
          </Button>
        </Group>
      </Group>

      <Box className="manage-team-section">
        <Title order={2}>Team Basic Info</Title>

        <Box className="team-basic-info-layout">
          <Stack gap="md">
            <TextInput
              classNames={{ input: "manage-team-input", label: "manage-team-input-label" }}
              label="Team Name"
              onChange={(event) => setTeamName(event.currentTarget.value)}
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
                  <span>{getInitials(teamName)}</span>
                </Box>
              )}
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
    </Stack>
  );
}
