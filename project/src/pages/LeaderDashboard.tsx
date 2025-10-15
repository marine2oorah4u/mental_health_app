import React, { useState } from 'react';
import {
  Calendar,
  Users,
  ClipboardList,
  Lightbulb,
  Clock,
  Tent,
} from 'lucide-react';
import { TipsPanel } from '../components/TipsPanel';
import { MeetingPlanner } from '../components/MeetingPlanner';
import { CampoutPlanner } from '../components/CampoutPlanner';
import { CalendarView } from '../components/CalendarView';

export function LeaderDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'meeting' | 'campout' | 'calendar' | 'checklist'>(
    'overview'
  );

  const planningTools = [
    {
      id: 'meeting',
      title: 'Meeting Planner',
      description: 'Plan an inclusive troop meeting with activity suggestions',
      icon: Users,
      color: 'primary',
    },
    {
      id: 'campout',
      title: 'Campout Planner',
      description: 'Organize a camping trip with accommodation checklists',
      icon: Tent,
      color: 'success',
    },
    {
      id: 'calendar',
      title: 'Calendar View',
      description: 'View all your planned meetings and campouts in one place',
      icon: Calendar,
      color: 'accent',
    },
  ];

  const quickTips = [
    {
      title: 'Start with Structure',
      description: 'Use consistent routines and visual schedules to help Scouts with autism and ADHD',
      icon: Calendar,
    },
    {
      title: 'Build in Breaks',
      description: 'Include 5-10 minute sensory breaks between activities for regulation',
      icon: Clock,
    },
    {
      title: 'Communicate Early',
      description: 'Share plans with families 1-2 weeks in advance for preparation',
      icon: Lightbulb,
    },
  ];

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="hero-section">
        <h2 className="hero-title">
          <span className="hero-highlight">Leader Planning</span> Assistant
        </h2>
        <p className="hero-description">
          Tools and resources to plan inclusive meetings, campouts, and activities that work for
          every Scout in your unit.
        </p>
      </div>

      <div className="planning-tools-grid">
        {planningTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id as any)}
              className={`planning-tool-card card-${tool.color}`}
            >
              <div className="tool-icon">
                <Icon size={32} />
              </div>
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
            </button>
          );
        })}
      </div>

      <div className="quick-tips-section">
        <h3 className="section-title">Quick Planning Tips</h3>
        <div className="quick-tips-grid">
          {quickTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="quick-tip-card">
                <Icon size={24} className="tip-icon" />
                <h4 className="tip-title">{tip.title}</h4>
                <p className="tip-description">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMeetingPlanner = () => (
    <div className="planner-container">
      <h2 className="planner-title">Meeting Planner</h2>
      <p className="planner-description">
        Build a structured meeting plan with timing, activities, and accommodations.
      </p>

      <div className="planner-form">
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-field-group">
            <div className="form-field">
              <label>Meeting Date</label>
              <input type="date" className="text-input" />
            </div>
            <div className="form-field">
              <label>Duration (minutes)</label>
              <input type="number" className="text-input" defaultValue="90" />
            </div>
            <div className="form-field">
              <label>Expected Attendance</label>
              <input type="number" className="text-input" placeholder="Number of Scouts" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Meeting Agenda</h3>
          <div className="agenda-builder">
            <div className="agenda-item">
              <div className="agenda-time">6:30 PM</div>
              <div className="agenda-details">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Activity name"
                  defaultValue="Opening Ceremony"
                />
                <input
                  type="number"
                  className="text-input time-input"
                  defaultValue="10"
                  placeholder="Minutes"
                />
              </div>
            </div>

            <div className="agenda-item">
              <div className="agenda-time">6:40 PM</div>
              <div className="agenda-details">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Activity name"
                  defaultValue="Skill Instruction"
                />
                <input
                  type="number"
                  className="text-input time-input"
                  defaultValue="30"
                  placeholder="Minutes"
                />
              </div>
            </div>

            <div className="agenda-item">
              <div className="agenda-time">7:10 PM</div>
              <div className="agenda-details">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Activity name"
                  defaultValue="Break / Snack"
                />
                <input
                  type="number"
                  className="text-input time-input"
                  defaultValue="10"
                  placeholder="Minutes"
                />
              </div>
            </div>

            <button className="btn btn-secondary btn-small">
              <Plus size={16} />
              Add Activity
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Accommodation Notes</h3>
          <textarea
            className="textarea"
            rows={4}
            placeholder="List any specific accommodations needed (quiet space for breaks, fidget tools available, visual schedule posted, etc.)"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">Save Meeting Plan</button>
          <button className="btn btn-secondary">Export to PDF</button>
        </div>
      </div>
    </div>
  );

  const renderCampoutPlanner = () => (
    <div className="planner-container">
      <h2 className="planner-title">Campout Planner</h2>
      <p className="planner-description">
        Organize an accessible camping experience with comprehensive planning checklists.
      </p>

      <div className="planner-form">
        <div className="form-section">
          <h3 className="form-section-title">Trip Details</h3>
          <div className="form-field-group">
            <div className="form-field">
              <label>Campout Name</label>
              <input type="text" className="text-input" placeholder="e.g., Fall Weekend Campout" />
            </div>
            <div className="form-field">
              <label>Start Date</label>
              <input type="date" className="text-input" />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input type="date" className="text-input" />
            </div>
          </div>
          <div className="form-field">
            <label>Location</label>
            <input type="text" className="text-input" placeholder="Camp name and address" />
          </div>
        </div>

        <div className="checklist-section">
          <h3 className="form-section-title">Accessibility Checklist</h3>

          <div className="checklist-category">
            <h4>Medical & Safety</h4>
            <label className="form-checkbox">
              <input type="checkbox" />
              Medication storage and administration plan
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Dietary accommodations identified and planned
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              First aid kit stocked with Scout-specific needs
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Emergency contacts for all Scouts verified
            </label>
          </div>

          <div className="checklist-category">
            <h4>Physical Access</h4>
            <label className="form-checkbox">
              <input type="checkbox" />
              Wheelchair-accessible paths identified
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Accessible bathroom facilities confirmed
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Sleeping arrangements accommodate mobility needs
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Activities have accessible alternatives
            </label>
          </div>

          <div className="checklist-category">
            <h4>Sensory Considerations</h4>
            <label className="form-checkbox">
              <input type="checkbox" />
              Quiet tent/space designated for breaks
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Noise-canceling headphones available
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Visual schedule created and shared
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Sensory-friendly activity options prepared
            </label>
          </div>

          <div className="checklist-category">
            <h4>Communication</h4>
            <label className="form-checkbox">
              <input type="checkbox" />
              Parent information packet sent (2 weeks advance)
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              AAC devices/communication boards available
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Leaders briefed on individual Scout needs
            </label>
            <label className="form-checkbox">
              <input type="checkbox" />
              Buddy assignments made with compatibility in mind
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">Save Campout Plan</button>
          <button className="btn btn-secondary">Print Checklist</button>
        </div>
      </div>
    </div>
  );

  const renderAccessibilityChecklist = () => (
    <div className="planner-container">
      <h2 className="planner-title">Accessibility Checklist</h2>
      <p className="planner-description">
        Use this checklist to ensure any Scouting activity is inclusive and accessible.
      </p>

      <div className="accessibility-checklist">
        <div className="checklist-section">
          <h3 className="form-section-title">Before the Activity</h3>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Communicate early:</strong> Share plans 1-2 weeks in advance with families
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Review individual needs:</strong> Check calm plans and accommodation requests
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Scout the location:</strong> Visit venue to identify accessibility features and
              barriers
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Prepare materials:</strong> Create visual schedules, modified instructions,
              communication boards
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Brief volunteers:</strong> Train leaders on accommodations and emergency
              protocols
            </span>
          </label>
        </div>

        <div className="checklist-section">
          <h3 className="form-section-title">During the Activity</h3>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Post visual schedule:</strong> Display where all Scouts can reference it
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Provide warnings:</strong> Give 5-minute and 2-minute transition warnings
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Maintain quiet space:</strong> Keep designated calm area available and
              accessible
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Check in regularly:</strong> Monitor Scouts for signs of stress or overwhelm
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Be flexible:</strong> Adapt plans as needed based on Scout responses
            </span>
          </label>
        </div>

        <div className="checklist-section">
          <h3 className="form-section-title">After the Activity</h3>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Debrief with Scout:</strong> Ask what worked well and what was challenging
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Update calm plans:</strong> Document strategies that were effective
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Share with parents:</strong> Communicate successes and any concerns
            </span>
          </label>
          <label className="form-checkbox">
            <input type="checkbox" />
            <span>
              <strong>Reflect with leaders:</strong> Discuss what accommodations worked and what to
              improve
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'meeting' && <MeetingPlanner />}
      {activeTab === 'campout' && <CampoutPlanner />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'checklist' && renderAccessibilityChecklist()}

      {activeTab !== 'overview' && (
        <div className="back-to-overview">
          <button onClick={() => setActiveTab('overview')} className="btn btn-secondary">
            Back to Overview
          </button>
        </div>
      )}

      <TipsPanel category="planning" context="general" />
    </div>
  );
}
