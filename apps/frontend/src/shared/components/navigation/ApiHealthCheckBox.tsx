import { Badge, Box, Card, Group, Text } from "@mantine/core";
import { useApiHealth } from "../../hooks/useApiHealth";

export function ApiHealthCheckBox() {
  const { apiStatus } = useApiHealth();

  return (
    <Card className="status-card" padding="md">
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text className="data-label">SYSTEM MONITOR</Text>
          <Text className="status-title">API connection</Text>
        </Box>
        <Badge
          className="status-chip"
          color={
            apiStatus === "connected"
              ? "green"
              : apiStatus === "offline"
                ? "red"
                : "orange"
          }
          variant="light"
        >
          {apiStatus === "connected"
            ? "ONLINE"
            : apiStatus === "checking"
              ? "DEGRADED"
              : "OFFLINE"}
        </Badge>
      </Group>
    </Card>
  );
}
