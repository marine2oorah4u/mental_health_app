import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  ClipboardList,
  Waves,
  MessageSquare,
  BookOpen,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  User,
} from 'lucide-react';
import { CalmPlanBuilder } from '../components/CalmPlanBuilder';
import { VisualScheduleBuilder } from '../components/VisualScheduleBuilder';
import { MeltdownTracker } from '../components/MeltdownTracker';
import { SensoryProfile } from '../components/SensoryProfile';
import { EmergencyProtocols } from '../components/EmergencyProtocols';
import { AutismResources } from '../components/AutismResources';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AutismSupportProps {
  onNavigate: (page: string) => void;
}

export function AutismSupport({ onNavigate }: AutismSupportProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedScoutId, setSelectedScoutId] = useState<string | undefined>(undefined);
  const [scoutProfiles, setScoutProfiles] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadScoutProfiles();
    }
  }, [user]);

  const loadScoutProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('scout_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScoutProfiles(data || []);
      if (data && data.length > 0 && !selectedScoutId) {
        setSelectedScoutId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading scout profiles:', error);
    }
  };

  const modules = [
    {
      id: 'calm-plan',
      title: 'Calm Plan Builder',
      description: 'Create personalized calm-down strategies and crisis protocols',
      icon: Heart,
      color: 'primary',
    },
    {
      id: 'visual-schedule',
      title: 'Visual Schedules',
      description: 'Build picture schedules for meetings, campouts, and events',
      icon: Calendar,
      color: 'secondary',
    },
    {
      id: 'meltdown-log',
      title: 'Meltdown Tracker',
      description: 'Log triggers, warning signs, and effective interventions',
      icon: ClipboardList,
      color: 'accent',
    },
    {
      id: 'sensory',
      title: 'Sensory Profile',
      description: 'Document sensory needs and accommodations',
      icon: Waves,
      color: 'success',
    },
    {
      id: 'emergency',
      title: 'Emergency Protocols',
      description: 'Crisis response and de-escalation strategies',
      icon: AlertTriangle,
      color: 'accent',
    },
    {
      id: 'resources',
      title: 'Resources & Education',
      description: 'Learning materials, organizations, and support',
      icon: BookOpen,
      color: 'success',
    },
  ];

  const keyFeatures = [
    {
      icon: AlertCircle,
      title: 'Early Warning Signs',
      description:
        'Recognize and respond to pre-meltdown cues before escalation occurs',
    },
    {
      icon: CheckCircle,
      title: 'Proven Strategies',
      description:
        'Evidence-based strategies and accommodations specifically for Scouting environments',
    },
    {
      icon: Heart,
      title: 'Individualized Support',
      description:
        'Every Scout is unique. Customize plans to match their specific needs and strengths',
    },
  ];

  const renderContent = () => {
    const toolsNeedingProfile = ['calm-plan', 'visual-schedule', 'meltdown-log', 'sensory'];
    const showProfileSelector = toolsNeedingProfile.includes(activeTab) && user;

    switch (activeTab) {
      case 'calm-plan':
        return (
          <>
            {showProfileSelector && renderScoutSelector()}
            <CalmPlanBuilder scoutProfileId={selectedScoutId} />
          </>
        );
      case 'visual-schedule':
        return (
          <>
            {showProfileSelector && renderScoutSelector()}
            <VisualScheduleBuilder scoutProfileId={selectedScoutId} />
          </>
        );
      case 'meltdown-log':
        return (
          <>
            {showProfileSelector && renderScoutSelector()}
            <MeltdownTracker scoutProfileId={selectedScoutId} />
          </>
        );
      case 'sensory':
        return (
          <>
            {showProfileSelector && renderScoutSelector()}
            <SensoryProfile scoutProfileId={selectedScoutId} />
          </>
        );
      case 'emergency':
        return <EmergencyProtocols />;
      case 'resources':
        return <AutismResources />;
      default:
        return (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  <span className="hero-highlight">Special Needs</span>
                  <br />
                  Support Tools
                </h1>
                <p className="hero-description">
                  Comprehensive support for all Scouts with special needs. Build calm plans, track
                  patterns, create visual schedules, and access proven strategies for success in
                  Scouting.
                </p>
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Support Modules</h2>
              <div className="card-grid">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveTab(module.id)}
                      className={`action-card card-${module.color}`}
                    >
                      <div className="action-card-icon">
                        <Icon size={32} />
                      </div>
                      <h3 className="action-card-title">{module.title}</h3>
                      <p className="action-card-description">{module.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Why These Tools Matter</h2>
              <div className="features-grid">
                {keyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">
                        <Icon size={28} />
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <div className="info-card">
                <h2 className="info-card-title">Supporting All Scouts</h2>
                <p className="info-card-text">
                  Every Scout is unique, with individual strengths, challenges, and needs. These tools
                  support Scouts with various special needs including autism, ADHD, sensory processing
                  differences, anxiety, and other conditions. With the right accommodations and understanding,
                  all Scouts can thrive in Scouting's structured, hands-on environment.
                </p>
                <p className="info-card-text">
                  <strong>Universal supports:</strong> Clear communication, visual schedules, predictable
                  routines, sensory accommodations, individualized strategies, and celebrating each Scout's
                  unique strengths.
                </p>
                <p className="info-card-text">
                  <strong>Remember:</strong> These tools are flexible and adaptable. Use what works for your
                  Scouts and customize approaches to meet their specific needs.
                </p>
              </div>
            </div>
          </>
        );
    }
  };

  const renderScoutSelector = () => (
    <div className="scout-selector mb-6">
      <label className="form-label">
        <User size={16} /> Select Scout Profile:
      </label>
      {scoutProfiles.length > 0 ? (
        <select
          className="text-input"
          value={selectedScoutId || ''}
          onChange={(e) => setSelectedScoutId(e.target.value || undefined)}
        >
          <option value="">General (not linked to specific Scout)</option>
          {scoutProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.first_name} {profile.last_name}
            </option>
          ))}
        </select>
      ) : (
        <div className="alert-box alert-warning">
          <p>
            No Scout profiles found.{' '}
            <button
              onClick={() => onNavigate('profiles')}
              className="text-link"
            >
              Create a Scout profile first
            </button>{' '}
            to link this data.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      {activeTab !== 'overview' && (
        <div className="back-navigation">
          <button onClick={() => setActiveTab('overview')} className="btn-back">
            <ArrowLeft size={20} />
            Back to Overview
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
