import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Phone, Mail, Globe, AlertCircle, CheckCircle, Flag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  disability_types: string[] | null;
  is_verified: boolean;
  submitted_by: string | null;
}

export function ResourceDirectory() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources_directory')
        .select('*')
        .order('name');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesState = selectedState === 'all' || resource.state === selectedState;
    const matchesZip = !zipCode || (resource.zip_code && resource.zip_code.startsWith(zipCode));

    return matchesSearch && matchesCategory && matchesState && matchesZip;
  });

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'medical', label: 'Medical' },
    { id: 'therapy', label: 'Therapy' },
    { id: 'recreational', label: 'Recreational' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'advocacy', label: 'Advocacy' },
    { id: 'support_group', label: 'Support Groups' },
    { id: 'respite', label: 'Respite Care' },
    { id: 'education', label: 'Education' },
  ];

  const states = ['all', ...Array.from(new Set(resources.map((r) => r.state))).sort()];

  if (loading) {
    return (
      <div className="page-container">
        <div className="hero-section">
          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Resource Directory</span>
            <br />
            Local Disability Support
          </h1>
          <p className="hero-description">
            Find local organizations, services, and support for Scouts with disabilities. Search by
            location, category, or specific disability type.
          </p>
        </div>
      </div>

      <div className="alert-box alert-info mb-6">
        <AlertCircle size={24} />
        <div>
          <strong>Community Resource Directory:</strong> This directory includes both verified
          organizations and community-submitted resources. Always verify services and qualifications
          independently before engaging. Resources marked with{' '}
          <CheckCircle size={16} className="inline text-success" /> are admin-verified.
        </div>
      </div>

      <div className="section">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, city, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="search-box" style={{ maxWidth: '200px' }}>
            <MapPin size={20} />
            <input
              type="text"
              placeholder="ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="search-input"
              maxLength={5}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex gap-2 items-center flex-wrap">
            <Filter size={20} className="text-muted" />
            <span className="text-sm font-semibold">Category:</span>
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

          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm font-semibold">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1 border rounded-md bg-surface"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <h3>No resources found</h3>
            <p>
              {searchTerm || selectedCategory !== 'all' || selectedState !== 'all' || zipCode
                ? 'Try adjusting your search or filters'
                : 'No resources have been added yet. Check back soon or help us grow the directory!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{resource.name}</h3>
                        {resource.is_verified && (
                          <CheckCircle
                            size={20}
                            className="text-success"
                            title="Admin Verified"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-secondary text-xs capitalize">
                          {resource.category.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted">
                          {resource.city}, {resource.state}
                          {resource.zip_code && ` ${resource.zip_code}`}
                        </span>
                      </div>
                      <p className="text-muted mb-3">{resource.description}</p>

                      {resource.disability_types && resource.disability_types.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-sm font-semibold">Serves:</span>
                          {resource.disability_types.map((type, idx) => (
                            <span key={idx} className="badge badge-default text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {resource.phone && (
                          <a
                            href={`tel:${resource.phone}`}
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Phone size={16} />
                            {resource.phone}
                          </a>
                        )}
                        {resource.email && (
                          <a
                            href={`mailto:${resource.email}`}
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Mail size={16} />
                            {resource.email}
                          </a>
                        )}
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <Globe size={16} />
                            Visit Website
                          </a>
                        )}
                      </div>

                      {resource.address && (
                        <p className="text-sm text-muted mt-2">
                          <MapPin size={14} className="inline mr-1" />
                          {resource.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-small"
                    title="Report issue with this resource"
                  >
                    <Flag size={16} />
                  </button>
                </div>

                {!resource.is_verified && resource.submitted_by && (
                  <div className="text-xs text-muted border-t pt-2 mt-2">
                    Community submitted • Not yet verified by admin
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="info-card">
          <h3 className="info-card-title">About This Directory</h3>
          <p className="info-card-text">
            This resource directory is community-driven and includes organizations, services, and
            programs that support individuals with disabilities. Resources are submitted by community
            members and verified by administrators when possible.
          </p>
          <p className="info-card-text">
            <strong>Always verify:</strong> Contact organizations directly to confirm current
            services, costs, availability, and qualifications. This directory is for informational
            purposes only and does not constitute an endorsement.
          </p>
          <div className="mt-4">
            <button className="btn btn-primary">
              Submit a Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
