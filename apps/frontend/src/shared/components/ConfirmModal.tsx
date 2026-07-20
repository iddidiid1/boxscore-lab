import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import "./ConfirmModal.css";

export type ConfirmModalProps = {
  opened: boolean;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Consequence description. A string is wrapped in <Text>; nodes are rendered as-is. */
  children?: ReactNode;
  danger?: boolean;
  error?: ReactNode;
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
  error,
  loading = false,
  cancelLabel = "Cancel"
}: ConfirmModalProps) {
  return (
    <Modal
      centered
      classNames={{
        body: "app-confirm-modal__body",
        content: "app-confirm-modal__content",
        header: "app-confirm-modal__header",
        title: "app-confirm-modal__title"
      }}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      onClose={onCancel}
      opened={opened}
      title={title}
    >
      <Stack gap="md">
        {typeof children === "string" ? <Text>{children}</Text> : children}
        {error ? (
          <Alert className="app-confirm-modal__error" color="red" role="alert">
            {error}
          </Alert>
        ) : null}
        <Group className="app-confirm-modal__actions" justify="flex-end">
          <Button
            className="app-action-button app-action-button--cancel"
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
