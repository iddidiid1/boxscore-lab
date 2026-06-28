import { Box, Text, Title } from "@mantine/core";
import "./ListEmptyState.css";

type ListEmptyStateProps = {
  title: string;
  description: string;
};

export function ListEmptyState({ title, description }: ListEmptyStateProps) {
  return (
    <Box className="list-empty-state">
      <Title order={3}>{title}</Title>
      <Text className="page-summary" mt="xs">
        {description}
      </Text>
    </Box>
  );
}
