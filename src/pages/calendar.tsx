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

interface Event {
  title: string;
  date: string;
  time: string | null;
  description: string;
  type: string;
  course?: string;
  start?: Date;
  end?: Date;
}

interface Course {
  courseCode: string;
  courseName: string;
  eventTypes: string[];
  events: Event[];
}

export default function CalendarPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (calendarData) {
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

  const filteredEvents = selectedCourse
    ? events.filter((ev) => ev.course === selectedCourse)
    : events;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return '#DC2626';
      case 'assignment': return '#2563EB';
      case 'quiz': return '#CA8A04';
      case 'class': return '#16A34A';
      case 'conference': return '#9333EA';
      case 'meeting': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEvent = (updatedEvent: Event) => {
    // Update the events state
    const updatedEvents = events.map(ev => 
      ev.title === editingEvent?.title && ev.date === editingEvent?.date 
        ? { ...updatedEvent, start: new Date(`${updatedEvent.date}T${updatedEvent.time || "00:00"}`), end: new Date(`${updatedEvent.date}T${updatedEvent.time || "23:59"}`) }
        : ev
    );
    
    setEvents(updatedEvents);
    
    // Update the courses state
    const updatedCourses = courses.map(course => ({
      ...course,
      events: course.events.map(ev => 
        ev.title === editingEvent?.title && ev.date === editingEvent?.date 
          ? updatedEvent 
          : ev
      )
    }));
    
    setCourses(updatedCourses);

    // Update the calendarData object (simulating persistence)
    calendarData.events = calendarData.events.map(ev => 
      ev.title === editingEvent?.title && ev.date === editingEvent?.date 
        ? { ...updatedEvent}
        : ev
    );

    // If adding a new event (no editingEvent match), append to calendarData.events
    if (!calendarData.events.some(ev => ev.title === editingEvent?.title && ev.date === editingEvent?.date)) {
      calendarData.events.push({ ...updatedEvent});
    }
    
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventToDelete: Event) => {
    setDeletingEvent(eventToDelete);
    setIsDeleteModalOpen(true);
    
  };

  const confirmDeleteEvent = () => {
    if (deletingEvent) {
      // Update the events state
      const updatedEvents = events.filter(ev => 
        !(ev.title === deletingEvent.title && ev.date === deletingEvent.date)
      );
      
      setEvents(updatedEvents);

      console.log('Updated Events after deletion:', updatedEvents);
      
      // Update the courses state
      const updatedCourses = courses.map(course => ({
        ...course,
        events: course.events.filter(ev => 
          !(ev.title === deletingEvent.title && ev.date === deletingEvent.date)
        )
      }));
      
      setCourses(updatedCourses);

      // Update the calendarData object (simulating persistence)
      calendarData.events = calendarData.events.filter(ev => 
        !(ev.title === deletingEvent.title && ev.date === deletingEvent.date)
      );

      
    }
    setIsDeleteModalOpen(false);
    setDeletingEvent(null);
  };

  const handleAddEvent = () => {
    const newEvent: Event = {
      title: "New Event",
      date: new Date().toISOString().split('T')[0],
      time: "00:00",
      description: "Event description",
      type: "class",
      course: courses[0]?.courseCode || ""
    };
    
    setEditingEvent(newEvent);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SyllabusTo<span className="text-red-600">Calendar</span>
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/submit" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Courses</h2>
            </div>
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
                    <button
                      onClick={handleAddEvent}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      + Add Event
                    </button>
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
              onSelectEvent={(event: Event) => {
                handleEditEvent(event);
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
            {events.map((event: Event, index: number) => (
              <div 
                key={index} 
                className="border-l-4 pl-4 py-2 group relative"
                style={{ borderColor: getEventTypeColor(event.type) }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="hidden group-hover:flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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
                    {event.time && event.time !== "00:00" && (
                      <p className="text-sm text-gray-600">{event.time}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-center">Export Calendar</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex flex-col items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors" onClick={() => { openGoogleCalendarImport(calendarData)}}>
                <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12h-10v10h10v-10zm10 0h-10v10h10v-10zm-10-12h-10v10h10v-10zm10 0h-10v10h10v-10z"/>
                </svg>
                <span>Google Calendar</span>
              </button>

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

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <EditEventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onCancel={() => setIsEditModalOpen(false)}
              eventTypes={calendarData.eventTypes}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete the event "{deletingEvent.title}" on {new Date(deletingEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingEvent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

// Edit Event Form Component
function EditEventForm({ event, onSave, onCancel, eventTypes }: { event: Event; onSave: (event: Event) => void; onCancel: () => void; eventTypes: string[] }) {
  const [formData, setFormData] = useState(event);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            value={formData.time || ''}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Event Type</label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}