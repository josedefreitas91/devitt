import { useEffect, useState } from "react"

const DATE_UNITS = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
]

const DATE_UNITS_INTERVAL = {
  hour: 3600000,
  minute: 60000,
  second: 5000,
}

const getDateDiffs = (timestamp) => {
  const now = Date.now()
  const elapsed = (timestamp - now) / 1000

  for (const [unit, secondsInUnit] of DATE_UNITS) {
    if (Math.abs(elapsed) > secondsInUnit || unit === "second") {
      const value = Math.floor(elapsed / secondsInUnit)
      return { value, unit }
    }
  }
}

export default function useTimeAgo(timestamp) {
  const rtf = new Intl.RelativeTimeFormat("es", { style: "long" })
  const [timeAgo, setTimeAgo] = useState(() => getDateDiffs(timestamp))
  const { value, unit } = timeAgo

  useEffect(() => {
    if (unit === "day") return

    let interval = null
    const intervalEffect = () => {
      const newTimeAgo = getDateDiffs(timestamp)
      setTimeAgo(newTimeAgo)
      if (unit !== newTimeAgo.unit && newTimeAgo.unit !== "day") {
        clearInterval(interval)
        interval = setInterval(
          intervalEffect,
          DATE_UNITS_INTERVAL[newTimeAgo.unit]
        )
      }
    }
    interval = setInterval(intervalEffect, DATE_UNITS_INTERVAL[unit])

    return () => clearInterval(interval)
  }, [timestamp])

  return rtf.format(value, unit)
}
