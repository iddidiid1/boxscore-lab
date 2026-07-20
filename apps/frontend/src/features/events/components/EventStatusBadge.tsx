import { Badge } from "@mantine/core";
import type { EventStatus } from "../types";
import "./EventStatusBadge.css";

type EventStatusBadgeProps = {
  status: EventStatus;
};

const statusLabels: Record<EventStatus, string> = {
  PREPARING: "Preparing",
  ONGOING: "Ongoing",
  COMPLETED: "Completed"
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <Badge className="event-status-badge app-edge-plate" data-status={status} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
}
