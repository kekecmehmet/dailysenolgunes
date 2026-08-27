export function dateInIstanbul(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function millisecondsUntilPostTime(date = new Date()) {
  // Türkiye yıl boyunca UTC+3: 21:00 Europe/Istanbul = 18:00 UTC.
  const target = new Date(`${dateInIstanbul(date)}T18:00:00Z`).getTime();
  return Math.max(0, target - date.getTime());
}

export function shouldSkipEarlyScheduledRun(date = new Date(), maximumWaitMinutes = 15) {
  return millisecondsUntilPostTime(date) > maximumWaitMinutes * 60 * 1000;
}
