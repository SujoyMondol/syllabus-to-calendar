/* eslint-disable */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../app/globals.css';

interface CalendarEvent {
  title: string;
  date: string;
  time: string | null;
  description: string;
  type: string;
}

export default function ListPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  useEffect(() => {
    // Retrieve events from sessionStorage or localStorage
    const storedEvents = sessionStorage.getItem('syllabusEvents');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents.events || []);
      } catch (error) {
        console.error('Error parsing stored events:', error);
      }
    }
  }, []);

  // Get unique event types for filtering
  const eventTypes = ['all', ...new Set(events.map(event => event.type))];

  // Filter events based on selected type
  const filteredEvents = events.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  // Sort events based on selected criteria
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Group events by date for easier navigation
  const eventsByDate: { [date: string]: CalendarEvent[] } = {};
  sortedEvents.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get event type color
  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      exam: 'bg-red-600',
      assignment: 'bg-blue-600',
      class: 'bg-green-600',
      quiz: 'bg-purple-600',
      project: 'bg-orange-600',
      holiday: 'bg-yellow-600',
      other: 'bg-gray-600',
    };
    return colors[type.toLowerCase()] || 'bg-gray-600';
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
            Upload Syllabus
          </Link>
          <Link href="/calendar" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
            Calendar View
          </Link>
          <Link href="/list" className="px-4 py-2 rounded bg-white text-black transition-colors">
            List View
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Course Schedule</h1>
        <p className="text-gray-300 mb-8">
          All your important dates and deadlines in one organized list.
        </p>

        {/* Filters and Sorting */}
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <label htmlFor="filter-type" className="block text-sm font-medium mb-1">
                Filter by Type
              </label>
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded w-full md:w-auto"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium mb-1">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded w-full md:w-auto"
              >
                <option value="date">Date</option>
                <option value="type">Type</option>
                <option value="title">Title</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <span className="text-sm">
                Showing {sortedEvents.length} of {events.length} events
              </span>
            </div>
          </div>
        </div>

        {/* Events List */}
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 mb-4">No events found.</p>
            <Link 
              href="/submit" 
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
            >
              Upload a Syllabus
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-red-600 px-4 py-2">
                  <h2 className="text-xl font-bold">{formatDate(date)}</h2>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {dateEvents.map((event, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start">
                        <div className={`${getEventTypeColor(event.type)} text-white text-xs px-2 py-1 rounded-full mr-3`}>
                          {event.type.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                          <p className="text-gray-300 mb-2">{event.description}</p>
                          {event.time && (
                            <p className="text-sm text-gray-400">
                              Time: {event.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Options */}
        {sortedEvents.length > 0 && (
          <div className="mt-8 bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Export Options</h3>
            <div className="flex flex-wrap gap-3">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Export to Google Calendar
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Download as ICS
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Print Schedule
              </button>
            </div>
          </div>
        )}
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