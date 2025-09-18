/* eslint-disable */
import { generateICS } from "./icsGenerator";

export function downloadICS(calendarData: any) {
  const icsContent = generateICS(calendarData);

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${calendarData.courseCode}_${calendarData.courseName}.ics`;
  a.click();

  URL.revokeObjectURL(url);
}