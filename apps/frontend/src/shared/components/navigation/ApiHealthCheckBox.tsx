import { useApiHealth } from "../../hooks/useApiHealth";

const STATUS_TEXT = {
  connected: "Online",
  checking: "Checking",
  offline: "Offline"
} as const;

export function ApiHealthCheckBox() {
  const { apiStatus } = useApiHealth();

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="api-health-footer"
      data-status={apiStatus}
      role="status"
    >
      <span aria-hidden="true" className={`api-status-dot api-status-dot--${apiStatus}`} />
      <span className="api-health-label">API</span>
      <span className="api-health-status">{STATUS_TEXT[apiStatus]}</span>
    </div>
  );
}
