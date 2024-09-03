export default function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) {
    return years === 1 ? "1y ago" : `${years}y ago`;
  } else if (months > 0) {
    return months === 1 ? "1mo ago" : `${months}mo ago`;
  } else if (days > 0) {
    return days === 1 ? "1d ago" : `${days}d ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1h ago" : `${hours}h ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1m ago" : `${minutes}m ago`;
  } else {
    return seconds === 1 ? "1s ago" : `${seconds}s ago`;
  }
}