import { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Heart, Shield, User } from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export function PanicButton() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: '', phone: '', relationship: 'Parent/Guardian' },
  ]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isPanicking, setIsPanicking] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasSetup, setHasSetup] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('emergency-contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].phone) {
          setContacts(parsed);
          setHasSetup(true);
        }
      } catch (e) {
        // Invalid data
      }
    }
  }, []);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      executeEmergencyAlert();
    }
  }, [countdown]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
      },
      (error) => {
        setLocationError('Unable to get location: ' + error.message);
      }
    );
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '', relationship: '' }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length === 1) return;
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const saveContacts = () => {
    localStorage.setItem('emergency-contacts', JSON.stringify(contacts));
    setHasSetup(true);
    alert('Emergency contacts saved!');
  };

  const startPanicSequence = () => {
    if (!hasSetup || !contacts[0].phone) {
      alert('Please set up at least one emergency contact first!');
      return;
    }

    setIsPanicking(true);
    setCountdown(5);
    getLocation();

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const cancelPanic = () => {
    setIsPanicking(false);
    setCountdown(null);

    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  const executeEmergencyAlert = () => {
    const primaryContact = contacts[0];
    const locationText = location
      ? `Location: https://www.google.com/maps?q=${location.lat},${location.lng}`
      : 'Location unavailable';

    const message = `EMERGENCY ALERT from Scout App!\n\nI need help right now.\n\n${locationText}\n\nThis is an automated alert.`;

    const smsUrl = `sms:${primaryContact.phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;

    setTimeout(() => {
      const phoneUrl = `tel:${primaryContact.phone}`;
      if (confirm(`Call ${primaryContact.name} at ${primaryContact.phone}?`)) {
        window.location.href = phoneUrl;
      }
    }, 2000);

    setIsPanicking(false);
    setCountdown(null);
  };

  if (isPanicking && countdown !== null) {
    return (
      <div className="tool-interactive">
        <div className="panic-countdown-screen">
          <div className="panic-countdown-content">
            <AlertCircle size={80} className="panic-countdown-icon" />
            <h1 className="panic-countdown-number">{countdown}</h1>
            <p className="panic-countdown-text">
              Sending emergency alert to<br />
              <strong>{contacts[0].name || contacts[0].phone}</strong>
            </p>
            {location && (
              <p className="panic-location-text">
                <MapPin size={16} />
                Location acquired
              </p>
            )}
          </div>
          <button
            onClick={cancelPanic}
            className="panic-cancel-button"
          >
            CANCEL - I'm Okay
          </button>
        </div>
      </div>
    );
  }

  if (!hasSetup || !contacts[0].phone) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <AlertCircle size={24} />
          <h2>Panic Button Setup</h2>
        </div>

        <div className="panic-setup-intro">
          <Shield size={48} />
          <h3>Safety First</h3>
          <p>
            Set up emergency contacts who will be notified if you need immediate help.
            They'll receive your location and a message that you need assistance.
          </p>
        </div>

        <div className="panic-setup-form">
          <h3>Emergency Contacts:</h3>
          {contacts.map((contact, index) => (
            <div key={index} className="panic-contact-form">
              <div className="panic-contact-number">{index + 1}</div>
              <div className="panic-contact-fields">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="panic-input"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, 'phone', e.target.value)}
                  placeholder="Phone Number"
                  className="panic-input"
                />
                <input
                  type="text"
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                  placeholder="Relationship"
                  className="panic-input"
                />
              </div>
              {contacts.length > 1 && (
                <button
                  onClick={() => removeContact(index)}
                  className="panic-remove-contact"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button onClick={addContact} className="btn btn-secondary">
            Add Another Contact
          </button>
        </div>

        <button onClick={saveContacts} className="btn btn-primary panic-save-button">
          Save & Enable Panic Button
        </button>

        <div className="tool-info">
          <h3>How It Works:</h3>
          <ul>
            <li>Press panic button when you need immediate help</li>
            <li>5-second countdown (can cancel if pressed by accident)</li>
            <li>Automatically sends SMS with your location</li>
            <li>Option to call primary contact</li>
            <li>Works even if you can't speak</li>
          </ul>
          <h3>When to Use:</h3>
          <ul>
            <li>Medical emergency</li>
            <li>Severe panic attack or meltdown</li>
            <li>Feel unsafe or lost</li>
            <li>Need immediate adult help</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <AlertCircle size={24} />
        <h2>Panic Button</h2>
      </div>

      <div className="panic-ready-screen">
        <div className="panic-status">
          <Shield size={32} />
          <h3>Emergency System Ready</h3>
          <p>Primary contact: <strong>{contacts[0].name}</strong></p>
        </div>

        <button
          onClick={startPanicSequence}
          className="panic-main-button"
        >
          <AlertCircle size={48} />
          <span>PRESS FOR HELP</span>
          <small>Hold to activate emergency alert</small>
        </button>

        <div className="panic-quick-actions">
          <h3>Quick Actions:</h3>
          <div className="panic-actions-grid">
            <button
              onClick={() => window.location.href = `tel:${contacts[0].phone}`}
              className="panic-action-button"
            >
              <Phone size={24} />
              <span>Call</span>
              <small>{contacts[0].name}</small>
            </button>

            <button
              onClick={getLocation}
              className="panic-action-button"
            >
              <MapPin size={24} />
              <span>Get Location</span>
              <small>{location ? 'Acquired' : 'Tap to get'}</small>
            </button>

            <button
              onClick={() => setHasSetup(false)}
              className="panic-action-button"
            >
              <User size={24} />
              <span>Edit Contacts</span>
              <small>{contacts.length} saved</small>
            </button>
          </div>
        </div>

        {location && (
          <div className="panic-location-info">
            <MapPin size={20} />
            <div>
              <strong>Current Location:</strong>
              <br />
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="panic-location-link"
              >
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </a>
            </div>
          </div>
        )}

        {locationError && (
          <div className="panic-location-error">
            <AlertCircle size={20} />
            {locationError}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Remember:</h3>
        <ul>
          <li><strong>Not a replacement for 911:</strong> For life-threatening emergencies, call 911</li>
          <li><strong>Use responsibly:</strong> Only for real emergencies</li>
          <li><strong>Keep contacts updated:</strong> Make sure phone numbers work</li>
          <li><strong>Test it:</strong> Let your contacts know about this feature</li>
        </ul>
        <h3>This Helps:</h3>
        <ul>
          <li>Get help quickly when you can't speak</li>
          <li>Share location automatically</li>
          <li>Feel safer during activities</li>
          <li>Emergency contact always available</li>
        </ul>
      </div>
    </div>
  );
}
