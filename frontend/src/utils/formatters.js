import {
  differenceInHours,
  differenceInMinutes,
  differenceInCalendarDays,
  format,
  isYesterday,
} from "date-fns";

export function formatSalary(min, max) {
  if (min == null && max == null) return "Not disclosed";
  const fmt = (n) => `$${Math.round(n / 1000)}k`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}/yr`;
  if (min != null) return `${fmt(min)}+/yr`;
  return `Up to ${fmt(max)}/yr`;
}

export function formatRelativeTime(isoString) {
  if (!isoString) return "Unknown";
  const date = new Date(isoString);
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  if (isYesterday(date)) return `Yesterday at ${format(date, "hh:mm a")}`;

  const days = differenceInCalendarDays(now, date);
  if (days < 7) return `${days} days ago`;

  return format(date, "MMM d, yyyy");
}

export function formatDateTime(isoString) {
  if (!isoString) return "Never";
  const date = new Date(isoString);
  return format(date, "MMM d, yyyy 'at' hh:mm a");
}

export function formatFileSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCountdown(targetIso) {
  if (!targetIso) return "—";
  const diffMs = new Date(targetIso).getTime() - Date.now();
  if (diffMs <= 0) return "Due now";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function getMatchColor(score) {
  if (score >= 85) return "var(--color-accent)";
  if (score >= 70) return "var(--color-amber)";
  return "var(--color-red)";
}

export function formatDuration(seconds) {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}
