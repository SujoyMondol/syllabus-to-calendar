/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../app/globals.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSearchParams } from "next/navigation";
import { downloadICS } from "../utils/downloadICS";
import { openGoogleCalendarImport } from "../utils/downloadGmail";
import { openOutlookCalendar } from "../utils/downloadOutlook";

// Import your local JSON data
import calendarData from "./calendar-data.json";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Use the imported JSON data
    if (calendarData) {
      // Format the events for react-big-calendar
      const formattedEvents = calendarData.events.map(event => ({
        ...event,
        start: new Date(`${event.date}T${event.time || "00:00"}`),
        end: new Date(`${event.date}T${event.time || "23:59"}`),
        title: event.title,
        course: calendarData.courseCode
      }));
      
      setCourses([calendarData]);
      setEvents(formattedEvents);
    }
  }, []);

  // Filter events based on course selection
  const filteredEvents = selectedCourse
    ? events.filter((ev) => ev.course === selectedCourse)
    : events;

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return '#DC2626'; // red
      case 'assignment': return '#2563EB'; // blue
      case 'quiz': return '#CA8A04'; // yellow
      case 'class': return '#16A34A'; // green
      case 'conference': return '#9333EA'; // purple
      default: return '#6B7280'; // gray
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SyllabusTo<span className="text-red-600">Calendar</span>
        </Link>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="/submit"
            className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors"
          >
            Upload New
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Course Calendar</h1>
          <p className="text-gray-300">
            All your important dates and deadlines in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Courses */}
          <div className="bg-white text-black rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Courses</h2>
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.courseCode}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedCourse === course.courseCode
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setSelectedCourse(
                      selectedCourse === course.courseCode
                        ? null
                        : course.courseCode
                    )
                  }
                >
                  <h3 className="font-bold">{course.courseCode}</h3>
                  <p className="text-sm">{course.courseName}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.eventTypes.map((type: string) => (
                      <span
                        key={type}
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: getEventTypeColor(type) }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="lg:col-span-2 bg-white text-black rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              className="rounded-lg"
              eventPropGetter={(event: any) => {
                return {
                  style: {
                    backgroundColor: getEventTypeColor(event.type),
                    borderRadius: "8px",
                    color: "white",
                    border: "none",
                    padding: "2px 6px",
                  },
                };
              }}
              onSelectEvent={(event: { title: any; description: any; date: any; time: any; }) => {
                alert(`${event.title}\n${event.description}\nDate: ${event.date}${event.time ? `\nTime: ${event.time}` : ''}`);
              }}
            />

            {/* Event Type Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-bold mb-3">Event Types:</h3>
              <div className="flex flex-wrap gap-3">
                {calendarData.eventTypes.map((type: string) => (
                  <div key={type} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getEventTypeColor(type) }}
                    ></div>
                    <span className="text-sm">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="mt-12 bg-white text-black rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">All Events</h2>
          <div className="space-y-4">
            {calendarData.events.map((event: any, index: number) => (
              <div 
                key={index} 
                className="border-l-4 pl-4 py-2"
                style={{ borderColor: getEventTypeColor(event.type) }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: getEventTypeColor(event.type) }}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {event.time && (
                      <p className="text-sm text-gray-600">{event.time}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-center">Export Calendar</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {/* Google Calendar Button */}
              <button className="flex flex-col items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors" onClick={() => { openGoogleCalendarImport(calendarData)}}>
                <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12h-10v10h10v-10zm10 0h-10v10h10v-10zm-10-12h-10v10h10v-10zm10 0h-10v10h10v-10z"/>
                </svg>
                <span>Google Calendar</span>
              </button>

              {/* Outlook Button */}
              <button className="flex flex-col items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => { openOutlookCalendar(calendarData)}}>
                <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12h-10v10h10v-10zm10 0h-10v10h10v-10zm-10-12h-10v10h10v-10zm10 0h-10v10h10v-10z"/>
                  <path d="M14.5 12h-5v5h5v-5z" fill="white"/>
                </svg>
                <span>Outlook</span>
              </button>

              {/* ICS Download Button */}
              <button className="flex flex-col items-center bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors" onClick={() => { downloadICS(calendarData)}}>
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download ICS</span>
              </button>
            </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SyllabusToCalendar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}