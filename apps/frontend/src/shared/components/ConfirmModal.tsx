import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export type ConfirmModalProps = {
  opened: boolean;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Consequence description. A string is wrapped in <Text>; nodes are rendered as-is. */
  children?: ReactNode;
  danger?: boolean;
  loading?: boolean;
  cancelLabel?: string;
};

// Shared confirmation dialog for destructive or consequential actions
// (archive, void, discarding unsaved changes). Replaces ad-hoc window.confirm
// and inline confirm UIs so all confirmations look and behave consistently.
export function ConfirmModal({
  opened,
  title,
  confirmLabel,
  onConfirm,
  onCancel,
  children,
  danger = false,
  loading = false,
  cancelLabel = "Cancel"
}: ConfirmModalProps) {
  return (
    <Modal centered onClose={onCancel} opened={opened} title={title}>
      <Stack gap="md">
        {typeof children === "string" ? <Text>{children}</Text> : children}
        <Group justify="flex-end">
          <Button
            className="app-action-button app-action-button--secondary"
            disabled={loading}
            onClick={onCancel}
            type="button"
            variant="default"
          >
            {cancelLabel}
          </Button>
          <Button
            className={`app-action-button ${danger ? "app-action-button--danger" : "app-action-button--primary"}`}
            loading={loading}
            onClick={onConfirm}
            type="button"
            variant={danger ? "outline" : "filled"}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
