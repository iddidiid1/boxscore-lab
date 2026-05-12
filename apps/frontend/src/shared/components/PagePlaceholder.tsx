import { Badge, Divider, Group, Text, Title } from "@mantine/core";

type PagePlaceholderProps = {
  description: string;
  signal: string;
  title: string;
};

export function PagePlaceholder({ description, signal, title }: PagePlaceholderProps) {
  return (
    <>
      <Group justify="space-between" mb="md">
        <Text className="data-label">ACTIVE PANEL</Text>
        <Badge className="status-chip" color="blue" variant="light">
          {signal}
        </Badge>
      </Group>
      <Title order={3}>{title}</Title>
      <Text className="module-copy" mt="sm">
        {description}
      </Text>
      <Divider my="lg" />
      <Group gap="xs">
        <Badge className="status-chip" color="green" variant="light">
          Local data
        </Badge>
        <Badge className="status-chip" color="orange" variant="light">
          Manual input
        </Badge>
      </Group>
    </>
  );
}
