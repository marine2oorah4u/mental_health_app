import { useState } from 'react';
import { AlertCircle, Phone, Save, Download, User, Heart } from 'lucide-react';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface MedicalInfo {
  allergies: string;
  medications: string;
  conditions: string;
  doctor: string;
  doctorPhone: string;
  insurance: string;
}

interface CommunicationPrefs {
  communicationStyle: string;
  triggers: string;
  calmingStrategies: string;
  emergencyNeeds: string;
}

export function EmergencyCard() {
  const [scoutName, setScoutName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: 'Parent/Guardian', phone: '' },
  ]);
  const [medical, setMedical] = useState<MedicalInfo>({
    allergies: '',
    medications: '',
    conditions: '',
    doctor: '',
    doctorPhone: '',
    insurance: '',
  });
  const [communication, setCommunication] = useState<CommunicationPrefs>({
    communicationStyle: '',
    triggers: '',
    calmingStrategies: '',
    emergencyNeeds: '',
  });

  const addContact = () => {
    setContacts([...contacts, { name: '', relationship: '', phone: '' }]);
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const removeContact = (index: number) => {
    if (contacts.length === 1) return;
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <AlertCircle size={24} />
        <h2>Emergency Contact Card</h2>
      </div>

      <div className="emergency-intro">
        <p>
          Create an emergency card with important medical, contact, and accommodation
          information. Keep this with leaders during activities.
        </p>
      </div>

      <div className="emergency-controls">
        <button onClick={handlePrint} className="btn btn-primary">
          <Download size={18} />
          Print Card
        </button>
        <button className="btn btn-secondary">
          <Save size={18} />
          Save
        </button>
      </div>

      <div className="emergency-form">
        <div className="emergency-section">
          <h3>
            <User size={20} />
            Scout Information
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scout Name</label>
              <input
                type="text"
                value={scoutName}
                onChange={(e) => setScoutName(e.target.value)}
                placeholder="Full name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="emergency-section">
          <h3>
            <Phone size={20} />
            Emergency Contacts
          </h3>
          {contacts.map((contact, index) => (
            <div key={index} className="emergency-contact-group">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                    placeholder="Contact name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    value={contact.relationship}
                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                    placeholder="e.g., Parent, Guardian"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    className="form-input"
                  />
                </div>
              </div>
              {contacts.length > 1 && (
                <button
                  onClick={() => removeContact(index)}
                  className="btn btn-danger btn-small"
                >
                  Remove Contact
                </button>
              )}
            </div>
          ))}
          <button onClick={addContact} className="btn btn-secondary">
            Add Another Contact
          </button>
        </div>

        <div className="emergency-section">
          <h3>
            <Heart size={20} />
            Medical Information
          </h3>
          <div className="form-group">
            <label className="form-label">Allergies</label>
            <textarea
              value={medical.allergies}
              onChange={(e) => setMedical({ ...medical, allergies: e.target.value })}
              placeholder="Food allergies, environmental allergies, etc."
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Medications</label>
            <textarea
              value={medical.medications}
              onChange={(e) => setMedical({ ...medical, medications: e.target.value })}
              placeholder="Current medications and dosages"
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Medical Conditions</label>
            <textarea
              value={medical.conditions}
              onChange={(e) => setMedical({ ...medical, conditions: e.target.value })}
              placeholder="Autism, ADHD, epilepsy, diabetes, etc."
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Doctor Name</label>
              <input
                type="text"
                value={medical.doctor}
                onChange={(e) => setMedical({ ...medical, doctor: e.target.value })}
                placeholder="Primary care physician"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Phone</label>
              <input
                type="tel"
                value={medical.doctorPhone}
                onChange={(e) => setMedical({ ...medical, doctorPhone: e.target.value })}
                placeholder="(555) 555-5555"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Insurance Information</label>
            <input
              type="text"
              value={medical.insurance}
              onChange={(e) => setMedical({ ...medical, insurance: e.target.value })}
              placeholder="Insurance company and policy number"
              className="form-input"
            />
          </div>
        </div>

        <div className="emergency-section">
          <h3>
            <AlertCircle size={20} />
            Communication & Accommodations
          </h3>
          <div className="form-group">
            <label className="form-label">Communication Style</label>
            <textarea
              value={communication.communicationStyle}
              onChange={(e) =>
                setCommunication({ ...communication, communicationStyle: e.target.value })
              }
              placeholder="How this scout communicates best (verbal, AAC, sign language, etc.)"
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Known Triggers</label>
            <textarea
              value={communication.triggers}
              onChange={(e) =>
                setCommunication({ ...communication, triggers: e.target.value })
              }
              placeholder="Situations or stimuli that may cause distress"
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Calming Strategies</label>
            <textarea
              value={communication.calmingStrategies}
              onChange={(e) =>
                setCommunication({ ...communication, calmingStrategies: e.target.value })
              }
              placeholder="What helps when this scout is upset or overwhelmed"
              className="form-textarea"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Emergency Needs</label>
            <textarea
              value={communication.emergencyNeeds}
              onChange={(e) =>
                setCommunication({ ...communication, emergencyNeeds: e.target.value })
              }
              placeholder="Important information for emergency responders"
              className="form-textarea"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>Important Notes:</h3>
        <ul>
          <li>Print and laminate this card for durability</li>
          <li>Keep with adult leaders during all activities</li>
          <li>Update whenever information changes</li>
          <li>Share with substitute leaders and volunteers</li>
          <li>Do not share publicly - this is confidential information</li>
        </ul>
      </div>

      <style>{`
        @media print {
          .tool-header, .emergency-intro, .emergency-controls, .tool-info,
          nav, footer {
            display: none !important;
          }
          .emergency-form {
            font-size: 11pt;
            line-height: 1.3;
          }
          .emergency-section {
            page-break-inside: avoid;
            border: 2px solid #000;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .emergency-section h3 {
            background: #000;
            color: #fff;
            padding: 0.25rem;
            margin: -0.5rem -0.5rem 0.5rem -0.5rem;
          }
          .form-input, .form-textarea {
            border: 1px solid #333;
            padding: 0.25rem;
            font-size: 10pt;
          }
          .btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
