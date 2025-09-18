import { generateICS } from "./icsGenerator";

export function openOutlookCalendar(calendarData: any) {
  const icsContent = generateICS(calendarData);

  // Create a Blob for the ICS file
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link
  const a = document.createElement("a");
  a.href = url;

  // Filename for the calendar
  a.download = `${calendarData.courseCode}_${calendarData.courseName}.ics`;

  // Trigger download — opening it in Outlook
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up
  URL.revokeObjectURL(url);
}