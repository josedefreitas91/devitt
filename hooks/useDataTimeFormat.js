export default function useDateTimeFormat(timestamp) {
  const date = new Date(timestamp)
  const language = "es-ES"
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }

  return new Intl.DateTimeFormat(language, options).format(date)
}
