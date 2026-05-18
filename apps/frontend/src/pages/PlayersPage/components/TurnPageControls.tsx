import { Group, Pagination, Text } from "@mantine/core";

type TurnPageControlsProps = {
  activePage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function TurnPageControls({
  activePage,
  pageSize,
  totalItems,
  onPageChange
}: TurnPageControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endItem = Math.min(activePage * pageSize, totalItems);

  return (
    <Group className="turn-page-controls" justify="space-between">
      <Text className="turn-page-summary">
        Showing {startItem}-{endItem} of {totalItems}
      </Text>
      <Pagination
        classNames={{
          control: "turn-page-button"
        }}
        onChange={onPageChange}
        total={totalPages}
        value={activePage}
      />
    </Group>
  );
}
