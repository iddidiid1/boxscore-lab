import { Badge, Box, Card, Group, Text } from "@mantine/core";
import { useApiHealth } from "../../hooks/useApiHealth";

export function ApiHealthCheckBox() {
  const { apiStatus, lastChecked } = useApiHealth();

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
      <Group className="status-readout" justify="space-between" mt="md">
        <Group gap={8}>
          <Box className={`status-dot ${apiStatus}`} />
          <Text className="status-state">
            {apiStatus === "connected"
              ? "Operational"
              : apiStatus === "checking"
                ? "Checking"
                : "No response"}
          </Text>
        </Group>
        <Text className="status-time">Last checked {lastChecked}</Text>
      </Group>
    </Card>
  );
}
