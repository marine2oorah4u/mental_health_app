import React, { useState } from 'react';
import { FileText, Download, Printer, ExternalLink, Search, Eye } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  category: 'medical' | 'advancement' | 'accommodation' | 'activity' | 'emergency';
  isPrintable: boolean;
  downloadUrl?: string;
  externalUrl?: string;
}

interface PrintableFormsProps {
  onPreview?: (form: Form) => void;
}

export function PrintableForms({ onPreview }: PrintableFormsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const forms: Form[] = [
    {
      id: 'calm-plan',
      title: 'Personal Calm Plan',
      description: 'Document triggers, warning signs, calming strategies, and emergency contacts for your Scout with autism or anxiety',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'sensory-checklist',
      title: 'Sensory Profile & Needs Checklist',
      description: 'Detailed checklist documenting your Scout\'s sensory preferences, triggers, and accommodations needed for camping and activities',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'medication-log',
      title: 'Medication Administration Log',
      description: 'Track medication timing, doses, and side effects during campouts, high adventure, and extended Scout events',
      category: 'medical',
      isPrintable: true,
    },
    {
      id: 'emergency-card',
      title: 'Emergency Contact & Medical Info Card',
      description: 'Wallet-sized card with critical medical info, allergies, disabilities, emergency contacts - perfect for camp and outings',
      category: 'emergency',
      isPrintable: true,
    },
    {
      id: 'dietary-restrictions',
      title: 'Dietary Needs & Food Allergy Form',
      description: 'Document food allergies, dietary restrictions, safe alternatives, and cross-contamination concerns for camp meals',
      category: 'medical',
      isPrintable: true,
    },
    {
      id: 'alternate-requirement',
      title: 'Alternate Requirement Request Form',
      description: 'Official form to request accommodations or modifications for rank advancement or merit badge requirements due to disability',
      category: 'advancement',
      isPrintable: true,
    },
    {
      id: 'visual-schedule',
      title: 'Visual Schedule Template (Printable)',
      description: 'Blank template with picture boxes for creating custom visual schedules for meetings, campouts, and daily routines',
      category: 'activity',
      isPrintable: true,
    },
    {
      id: 'behavior-log',
      title: 'Behavior Pattern & Meltdown Tracker',
      description: 'Track behavioral patterns, meltdown triggers, warning signs, and successful de-escalation strategies over time',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'communication-board',
      title: 'Picture Communication Board',
      description: 'Picture-based AAC tool for nonverbal or minimally verbal Scouts - includes common needs, feelings, and Scout activities',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'meeting-agenda',
      title: 'Inclusive Meeting Agenda Template',
      description: 'Pre-formatted meeting agenda with built-in sensory breaks, transition warnings, and accommodation reminders',
      category: 'activity',
      isPrintable: true,
    },
    {
      id: 'campout-checklist',
      title: 'Accessible Campout Planning Checklist',
      description: 'Comprehensive checklist covering accessibility needs, medications, sensory accommodations, and emergency protocols for camping',
      category: 'activity',
      isPrintable: true,
    },
    {
      id: 'buddy-system',
      title: 'Scout Buddy System Setup Form',
      description: 'Match Scouts with compatible buddies and document buddy responsibilities, communication strategies, and support needs',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'parent-handout',
      title: 'Parent Information Handout',
      description: 'Give to new Scout families - explains inclusion policies, accommodation process, and available resources',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'seizure-protocol',
      title: 'Seizure Emergency Action Plan',
      description: 'Document seizure type, triggers, first aid steps, medication protocol, and emergency contacts for Scouts with epilepsy',
      category: 'emergency',
      isPrintable: true,
    },
    {
      id: 'diabetes-protocol',
      title: 'Diabetes Management Plan',
      description: 'Blood sugar monitoring schedule, insulin administration, hypoglycemia protocol, and emergency contacts for diabetic Scouts',
      category: 'emergency',
      isPrintable: true,
    },
    {
      id: 'allergy-action',
      title: 'Anaphylaxis Emergency Action Plan',
      description: 'Critical allergy information, EpiPen administration instructions, symptom recognition, and emergency response steps',
      category: 'emergency',
      isPrintable: true,
    },
    {
      id: 'social-story',
      title: 'Social Story Template',
      description: 'Blank template for creating custom social stories to prepare Scouts for new situations, activities, or transitions',
      category: 'accommodation',
      isPrintable: true,
    },
    {
      id: 'health-form',
      title: 'Annual Health & Medical Record (AHMR)',
      description: 'Official Scouting America medical form required for all activities (Parts A, B, and C). Required for camp.',
      category: 'medical',
      isPrintable: false,
      externalUrl: 'https://www.scouting.org/health-and-safety/ahmr/',
    },
    {
      id: 'advancement-guidelines',
      title: 'Guide to Advancement - Section 10',
      description: 'Official BSA guidance on accommodations, alternate requirements, and advancement for Scouts with disabilities',
      category: 'advancement',
      isPrintable: false,
      externalUrl: 'https://www.scouting.org/resources/guide-to-advancement/',
    },
    {
      id: 'ada-guidelines',
      title: 'ADA Compliance Guidelines for Scouting',
      description: 'Americans with Disabilities Act requirements and best practices for inclusive Scout programs',
      category: 'accommodation',
      isPrintable: false,
      externalUrl: 'https://www.scouting.org/health-and-safety/disabilities-and-accommodations/',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Forms' },
    { id: 'medical', label: 'Medical & Health' },
    { id: 'accommodation', label: 'Accommodations' },
    { id: 'advancement', label: 'Advancement' },
    { id: 'activity', label: 'Activities' },
    { id: 'emergency', label: 'Emergency' },
  ];

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = (form: Form) => {
    console.log('Print form:', form.id);
    window.print();
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Printable Forms</span>
            <br />& Resources
          </h1>
          <p className="hero-description">
            Download and print forms, checklists, and tools to support your Scout. All forms are
            free and ready to use.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="forms-grid">
          {filteredForms.map((form) => (
            <div key={form.id} className="form-card">
              <div className="form-card-header">
                <FileText size={24} className="form-icon" />
                <span className={`form-badge form-badge-${form.category}`}>
                  {form.category.replace('-', ' ')}
                </span>
              </div>

              <h3 className="form-title">{form.title}</h3>
              <p className="form-description">{form.description}</p>

              <div className="form-actions">
                {form.isPrintable ? (
                  <>
                    {onPreview && (
                      <button className="btn btn-primary btn-small" onClick={() => onPreview(form)}>
                        <Eye size={16} />
                        Preview
                      </button>
                    )}
                    <button className="btn btn-secondary btn-small">
                      <Download size={16} />
                      PDF
                    </button>
                  </>
                ) : (
                  <a
                    href={form.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-small"
                  >
                    <ExternalLink size={16} />
                    View Official Form
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No forms found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
