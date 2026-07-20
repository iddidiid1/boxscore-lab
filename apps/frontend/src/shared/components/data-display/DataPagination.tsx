import { Group, Pagination, Text } from "@mantine/core";

type DataPaginationProps = {
  activePage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function DataPagination({
  activePage,
  pageSize,
  totalItems,
  onPageChange
}: DataPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endItem = Math.min(activePage * pageSize, totalItems);

  return (
    <Group className="app-data-pagination" justify="space-between">
      <Text className="app-data-pagination__summary">
        Showing {startItem}-{endItem} of {totalItems}
      </Text>
      <Pagination
        aria-label="Pagination"
        classNames={{
          control: "app-data-pagination__control"
        }}
        getControlProps={(control) => ({
          "aria-label":
            control === "first"
              ? "First page"
              : control === "previous"
                ? "Previous page"
                : control === "next"
                  ? "Next page"
                  : "Last page"
        })}
        onChange={onPageChange}
        total={totalPages}
        value={activePage}
      />
    </Group>
  );
}
