import React, { useState, useEffect } from 'react';
import { Save, FileText, CloudRain } from 'lucide-react';
import { getWeather } from '../services/weatherService';
import {
  createCampoutPlan,
  createChecklistItem,
  getCampoutPlans,
  CampoutPlan,
} from '../services/planningService';

const DEFAULT_CHECKLIST = [
  {
    category: 'Medical & Safety',
    items: [
      'Medication storage and administration plan',
      'Dietary accommodations identified and planned',
      'First aid kit stocked with Scout-specific needs',
      'Emergency contacts for all Scouts verified',
    ],
  },
  {
    category: 'Physical Access',
    items: [
      'Wheelchair-accessible paths identified',
      'Accessible bathroom facilities confirmed',
      'Sleeping arrangements accommodate mobility needs',
      'Activities have accessible alternatives',
    ],
  },
  {
    category: 'Sensory Considerations',
    items: [
      'Quiet tent/space designated for breaks',
      'Noise management plan for loud activities',
      'Sensory-friendly meal times established',
      'Visual schedule created and shared',
    ],
  },
  {
    category: 'Communication & Support',
    items: [
      'Visual schedule shared with families in advance',
      'Buddy system assigned',
      'Staff briefed on accommodations',
      'Communication devices/methods confirmed',
    ],
  },
];

export function CampoutPlanner() {
  const [campoutName, setCampoutName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [savedPlans, setSavedPlans] = useState<CampoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = await getCampoutPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const handleSave = async () => {
    if (!campoutName || !location || !startDate || !endDate) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const plan = await createCampoutPlan({
        campout_name: campoutName,
        location,
        start_date: startDate,
        end_date: endDate,
        notes: notes || null,
      });

      let orderIndex = 0;
      for (const category of DEFAULT_CHECKLIST) {
        for (const item of category.items) {
          const key = `${category.category}-${item}`;
          await createChecklistItem({
            campout_plan_id: plan.id,
            category: category.category,
            item_text: item,
            is_checked: checklist[key] || false,
            order_index: orderIndex++,
          });
        }
      }

      setMessage('Campout plan saved successfully!');
      await loadSavedPlans();

      // Reset form
      setCampoutName('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setNotes('');
      setChecklist({});
    } catch (error: any) {
      console.error('Error saving plan:', error);
      setMessage(error.message || 'Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <h2 className="planner-title">Campout Planner</h2>
      <p className="planner-description">
        Organize an accessible camping experience with comprehensive planning checklists.
      </p>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="planner-form">
        <div className="form-section">
          <h3 className="form-section-title">Trip Details</h3>
          <div className="form-field-group">
            <div className="form-field">
              <label>Campout Name</label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g., Fall Weekend Campout"
                value={campoutName}
                onChange={(e) => setCampoutName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Start Date</label>
              <input
                type="date"
                className="text-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input
                type="date"
                className="text-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Location</label>
            <div className="space-y-2">
              <input
                type="text"
                className="text-input"
                placeholder="Camp name and address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                type="button"
                onClick={async () => {
                  setLoadingWeather(true);
                  const data = await getWeather(44.3148, -85.6024);
                  setWeather(data);
                  setLoadingWeather(false);
                }}
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700"
                disabled={loadingWeather}
              >
                <CloudRain className="w-4 h-4" />
                {loadingWeather ? 'Loading...' : 'Get 7-Day Weather Forecast'}
              </button>
            </div>
          </div>
        </div>

        {weather && (
          <div className="card p-4 space-y-4">
            <h3 className="form-section-title flex items-center gap-2">
              <CloudRain className="w-5 h-5" />
              7-Day Weather Forecast
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {weather.forecast.map((day: any, idx: number) => (
                <div key={idx} className="text-center p-2 rounded border">
                  <div className="text-xs font-semibold text-muted">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl my-1">{day.icon}</div>
                  <div className="text-sm font-bold">{day.tempHigh}°</div>
                  <div className="text-xs text-muted">{day.tempLow}°</div>
                  {day.precipitation > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      {day.precipitation}"
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted italic">
              Weather data from Open-Meteo (Central Michigan). Check local forecasts closer to your campout date.
            </div>
          </div>
        )}

        <div className="checklist-section">
          <h3 className="form-section-title">Accessibility Checklist</h3>

          {DEFAULT_CHECKLIST.map((category) => (
            <div key={category.category} className="checklist-category">
              <h4>{category.category}</h4>
              {category.items.map((item) => {
                const key = `${category.category}-${item}`;
                return (
                  <label key={key} className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={checklist[key] || false}
                      onChange={() => toggleChecklistItem(key)}
                    />
                    {item}
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Additional Notes</h3>
          <textarea
            className="textarea"
            rows={4}
            placeholder="Any additional notes or special considerations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Campout Plan'}
          </button>
        </div>
      </div>

      {savedPlans.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title">Saved Campout Plans</h3>
          <div className="grid gap-4">
            {savedPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{plan.campout_name}</h4>
                    <p className="text-sm text-muted">{plan.location}</p>
                    <p className="text-sm text-muted">
                      {plan.start_date} to {plan.end_date}
                    </p>
                  </div>
                  <FileText size={20} className="text-success" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
