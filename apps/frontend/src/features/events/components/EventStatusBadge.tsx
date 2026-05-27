import { Badge } from "@mantine/core";
import type { EventStatus } from "../types";

type EventStatusBadgeProps = {
  status: EventStatus;
};

const statusLabels: Record<EventStatus, string> = {
  "not-started": "Not Started",
  ongoing: "Ongoing",
  completed: "Completed"
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <Badge className="event-status-badge" data-status={status} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
}
