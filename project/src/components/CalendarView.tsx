import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Users, Tent } from 'lucide-react';
import { getMeetingPlans, getCampoutPlans, MeetingPlan, CampoutPlan } from '../services/planningService';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'campout';
  data: MeetingPlan | CampoutPlan;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [meetings, campouts] = await Promise.all([
        getMeetingPlans(),
        getCampoutPlans(),
      ]);

      const meetingEvents: CalendarEvent[] = meetings.map(m => ({
        id: m.id,
        title: `Meeting (${m.expected_attendance || '?'} Scouts)`,
        date: new Date(m.meeting_date),
        type: 'meeting',
        data: m,
      }));

      const campoutEvents: CalendarEvent[] = campouts.map(c => ({
        id: c.id,
        title: c.campout_name,
        date: new Date(c.start_date),
        type: 'campout',
        data: c,
      }));

      setEvents([...meetingEvents, ...campoutEvents].sort((a, b) =>
        a.date.getTime() - b.date.getTime()
      ));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day calendar-day-empty" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'calendar-day-today' : ''} ${
            dayEvents.length > 0 ? 'calendar-day-has-events' : ''
          }`}
        >
          <div className="calendar-day-number">{day}</div>
          <div className="calendar-day-events">
            {dayEvents.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`calendar-event calendar-event-${event.type}`}
                title={event.title}
              >
                {event.type === 'meeting' ? (
                  <Users size={12} />
                ) : (
                  <Tent size={12} />
                )}
                <span className="calendar-event-title">{event.title}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={previousMonth} className="btn btn-secondary btn-small">
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-title">
            <Calendar size={24} className="inline mr-2" />
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="btn btn-secondary btn-small">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {renderCalendar()}
        </div>
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedEvent.type === 'meeting' ? (
                  <Users size={24} className="inline mr-2" />
                ) : (
                  <Tent size={24} className="inline mr-2" />
                )}
                {selectedEvent.title}
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedEvent.type === 'meeting' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold">Date</label>
                    <p>{(selectedEvent.data as MeetingPlan).meeting_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Duration</label>
                    <p>{(selectedEvent.data as MeetingPlan).duration_minutes} minutes</p>
                  </div>
                  {(selectedEvent.data as MeetingPlan).accommodation_notes && (
                    <div>
                      <label className="text-sm font-semibold">Accommodation Notes</label>
                      <p className="whitespace-pre-line">
                        {(selectedEvent.data as MeetingPlan).accommodation_notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold">Location</label>
                    <p>{(selectedEvent.data as CampoutPlan).location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Dates</label>
                    <p>
                      {(selectedEvent.data as CampoutPlan).start_date} to{' '}
                      {(selectedEvent.data as CampoutPlan).end_date}
                    </p>
                  </div>
                  {(selectedEvent.data as CampoutPlan).notes && (
                    <div>
                      <label className="text-sm font-semibold">Notes</label>
                      <p className="whitespace-pre-line">{(selectedEvent.data as CampoutPlan).notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
