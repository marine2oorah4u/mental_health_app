import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Globe, MapPin, Search, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CouncilContact {
  id: string;
  council_name: string;
  state: string;
  region: string | null;
  coordinator_name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  inclusion_page_url: string | null;
  notes: string | null;
  last_verified: string | null;
}

export function CouncilContacts() {
  const [contacts, setContacts] = useState<CouncilContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('council_contacts')
        .select('*')
        .order('state')
        .order('council_name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.council_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.coordinator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || contact.state === selectedState;
    return matchesSearch && matchesState;
  });

  const states = ['all', ...Array.from(new Set(contacts.map((c) => c.state))).sort()];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not verified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="hero-section">
          <p>Loading council contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Council Contacts</span>
            <br />
            Special Needs Coordinators
          </h1>
          <p className="hero-description">
            Connect with your local council's disability inclusion coordinator for support,
            resources, and guidance on making Scouting accessible for all youth.
          </p>
        </div>
      </div>

      <div className="alert-box alert-info mb-6">
        <AlertCircle size={24} />
        <div>
          <strong>Note:</strong> Contact information is community-maintained and may not always be
          current. For the most up-to-date information, visit your council's official website or
          contact them directly. If you notice outdated information, please let us know.
        </div>
      </div>

      <div className="section">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by council name, coordinator, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="text-sm font-semibold">Filter by State:</span>
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`filter-button ${selectedState === state ? 'active' : ''}`}
            >
              {state === 'all' ? 'All States' : state}
            </button>
          ))}
        </div>

        {contacts.length === 0 || filteredContacts.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>{contacts.length === 0 ? 'Coming Soon' : 'No contacts found'}</h3>
            <p>
              {contacts.length === 0
                ? 'Council contact information is being collected and verified. Check back soon, or contact your local council directly for special needs coordinator information.'
                : searchTerm || selectedState !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No council contacts match your criteria'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="card">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{contact.council_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={16} className="text-muted" />
                          <span className="text-sm text-muted">
                            {contact.state}
                            {contact.region && ` - ${contact.region}`}
                          </span>
                        </div>
                      </div>
                      <span className="badge badge-default text-xs">
                        Updated: {formatDate(contact.last_verified)}
                      </span>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-primary" />
                        <span className="font-semibold">{contact.coordinator_name}</span>
                        <span className="text-sm text-muted">Special Needs Coordinator</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Mail size={16} />
                            {contact.email}
                          </a>
                        )}

                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Phone size={16} />
                            {contact.phone}
                          </a>
                        )}

                        {contact.website && (
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Globe size={16} />
                            Council Website
                          </a>
                        )}

                        {contact.inclusion_page_url && (
                          <a
                            href={contact.inclusion_page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Globe size={16} />
                            Inclusion Resources
                          </a>
                        )}
                      </div>

                      {contact.notes && (
                        <div className="mt-3 p-3 bg-backgroundAlt rounded-lg">
                          <p className="text-sm">{contact.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="info-card">
          <h3 className="info-card-title">How Council Coordinators Can Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">For Parents:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Connect you with inclusive units in your area</li>
                <li>Provide resources and information about accommodations</li>
                <li>Answer questions about policies and procedures</li>
                <li>Help resolve concerns or issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Unit Leaders:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Training on disability awareness and inclusion</li>
                <li>Guidance on reasonable accommodations</li>
                <li>Support for alternate advancement requirements</li>
                <li>Resources and materials for inclusive programming</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="info-card bg-backgroundAlt">
          <h3 className="info-card-title">Don't See Your Council?</h3>
          <p className="info-card-text">
            Council contact information is being continuously added. If your council isn't listed,
            or if you notice incorrect information, you can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Visit your council's website directly</li>
            <li>Call your council's main office and ask for the special needs coordinator</li>
            <li>Contact your district executive for assistance</li>
            <li>
              Check with your unit commissioner who can help connect you with council resources
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
