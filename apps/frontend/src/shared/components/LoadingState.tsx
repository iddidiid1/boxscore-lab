import { Center, Loader, Stack, Text } from "@mantine/core";

type LoadingStateProps = {
  label: string;
  compact?: boolean;
};

export function LoadingState({ label, compact = false }: LoadingStateProps) {
  return (
    <Center
      aria-atomic="true"
      aria-live="polite"
      className="app-loading-state"
      data-compact={compact || undefined}
      role="status"
    >
      <Stack align="center" gap="xs">
        <Loader aria-hidden="true" size="sm" />
        <Text className="app-loading-state__label">{label}</Text>
      </Stack>
    </Center>
  );
}
