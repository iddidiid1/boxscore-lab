import { Box, Group, Text, Title } from "@mantine/core";

export function SidebarHeader() {
  return (
    <Group className="brand-lockup" align="center" gap="md">
      <Box className="brand-mark">FLS</Box>
      <Box>
        <Title order={1} className="brand-title">
          Fantasy League Stats
        </Title>
        <Text className="muted-copy">Local MVP console</Text>
      </Box>
    </Group>
  );
}
