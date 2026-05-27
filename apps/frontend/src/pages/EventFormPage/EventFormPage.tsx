import { EventForm } from "../../features/events";
import { mockEvents } from "../../features/events/data/mockEvents";
import type { EventSummary } from "../../features/events/types";

type EventFormPageProps = {
  eventId?: string;
  mode: "create" | "edit";
};

const blankEvent: EventSummary = {
  id: "new-event",
  name: "",
  tier: "B",
  status: "preparing",
  description: "",
  participatingTeamCount: 0,
  stageTags: [
    { id: "group-stage", label: "Group Stage" },
    { id: "final", label: "Final" }
  ],
  resultTags: [
    { id: "champion", label: "Champion", isWinnerTag: true, rankingPoints: 10 },
    { id: "runner-up", label: "Runner-up", isWinnerTag: false, rankingPoints: 7 },
    { id: "participant", label: "Participant", isWinnerTag: false, rankingPoints: 0 }
  ],
  results: []
};

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function EventFormPage({ eventId, mode }: EventFormPageProps) {
  const event =
    mode === "edit"
      ? mockEvents.find((eventItem) => eventItem.id === eventId) ?? mockEvents[0]
      : blankEvent;
  const cancelPath = mode === "edit" ? `/events/${event.id}` : "/events";

  return <EventForm event={event} mode={mode} onCancel={() => navigateTo(cancelPath)} />;
}
