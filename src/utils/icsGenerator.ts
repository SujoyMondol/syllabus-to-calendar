export function generateICS(calendarData: any): string {
  const { courseCode, courseName, events } = calendarData;

  function formatDateTime(date: string, time?: string) {
    if (!time) return null; // All-day event case
    const d = new Date(`${date}T${time}`);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${courseCode}//${courseName}//EN
CALSCALE:GREGORIAN
`;

  events.forEach((event: any, idx: number) => {
    let dtStart = "";
    let dtEnd = "";

    const startTime = formatDateTime(event.date, event.time);

    if (startTime) {
      // Timed event (default 1 hour duration)
      const start = new Date(`${event.date}T${event.time}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      dtStart = `DTSTART:${start.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
      dtEnd = `DTEND:${end.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
    } else {
      // All-day event
      dtStart = `DTSTART;VALUE=DATE:${event.date.replace(/-/g, "")}`;
      const nextDay = new Date(event.date);
      nextDay.setDate(nextDay.getDate() + 1);
      dtEnd = `DTEND;VALUE=DATE:${nextDay.toISOString().split("T")[0].replace(/-/g, "")}`;
    }

    icsContent += `BEGIN:VEVENT
UID:${idx}@${courseCode}
SUMMARY:${event.title}
DESCRIPTION:${event.description ?? ""}
${dtStart}
${dtEnd}
END:VEVENT
`;
  });

  icsContent += "END:VCALENDAR";

  return icsContent;
}
