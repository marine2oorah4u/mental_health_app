import React from 'react';
import { AlertTriangle, Phone, Heart, Clock, FileText, Share2 } from 'lucide-react';

export function EmergencyProtocols() {
  const protocols = [
    {
      title: 'Recognizing a Crisis',
      icon: AlertTriangle,
      content: [
        'Scout becomes non-responsive or unresponsive to name',
        'Self-injurious behaviors (hitting, biting self)',
        'Aggressive behaviors toward others',
        'Elopement (running away) risk',
        'Extended meltdown (>30 minutes) with no improvement',
        'Expressing thoughts of self-harm',
      ],
    },
    {
      title: 'Immediate Response Steps',
      icon: Heart,
      content: [
        '1. Ensure safety: Remove hazards, give space, stay calm',
        '2. Reduce stimulation: Lower lights, reduce noise, clear area',
        '3. Use known calm strategies from Scout\'s calm plan',
        '4. Do NOT restrain unless safety emergency (follow Scouting America policies)',
        '5. Contact parent/guardian immediately',
        '6. Call emergency services if needed: 911 or 988 (crisis line)',
      ],
    },
    {
      title: 'When to Call 911',
      icon: Phone,
      content: [
        'Risk of immediate harm to self or others',
        'Medical emergency (injury, medication issue, seizure)',
        'Scout has eloped and cannot be located',
        'Situation is beyond your training/comfort level',
      ],
    },
    {
      title: 'Crisis Prevention',
      icon: Clock,
      content: [
        'Watch for early warning signs (see Scout\'s calm plan)',
        'Intervene early with calm strategies',
        'Offer sensory breaks before escalation',
        'Modify activity demands if Scout is struggling',
        'Maintain consistent routines when possible',
        'Communicate clearly about transitions',
      ],
    },
  ];

  return (
    <div className="emergency-protocols">
      <div className="builder-header">
        <h2 className="section-title">Emergency Response Protocols</h2>
        <p className="hero-description">
          Critical information for leaders on recognizing crisis situations, responding safely, and
          knowing when to seek additional help. Review regularly and share with all unit leaders.
        </p>
      </div>

      <div className="alert-box alert-warning">
        <AlertTriangle size={24} />
        <div>
          <strong>For Leaders:</strong> Print and keep this information with Scout's medical forms.
          Review with all adults involved in activities. When in doubt, call the parent/guardian
          first, then emergency services if needed.
        </div>
      </div>

      <div className="protocols-grid">
        {protocols.map((protocol, index) => {
          const Icon = protocol.icon;
          return (
            <div key={index} className="protocol-card">
              <div className="protocol-header">
                <Icon size={28} />
                <h3 className="protocol-title">{protocol.title}</h3>
              </div>
              <ul className="protocol-list">
                {protocol.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="section">
        <h3 className="subsection-title">Important Phone Numbers</h3>
        <div className="contact-cards">
          <div className="contact-card">
            <div className="contact-icon emergency">
              <Phone size={24} />
            </div>
            <div className="contact-info">
              <div className="contact-title">Emergency Services</div>
              <div className="contact-number">911</div>
              <div className="contact-description">Police, fire, medical emergencies</div>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon crisis">
              <Phone size={24} />
            </div>
            <div className="contact-info">
              <div className="contact-title">National Crisis & Suicide Lifeline</div>
              <div className="contact-number">988</div>
              <div className="contact-description">
                24/7 mental health crisis support (call or text)
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon support">
              <Phone size={24} />
            </div>
            <div className="contact-info">
              <div className="contact-title">Autism Response Team</div>
              <div className="contact-number">888-288-4762</div>
              <div className="contact-description">Autism-specific crisis support (Autism Speaks)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="info-card">
          <h3 className="info-card-title">De-escalation Best Practices</h3>
          <div className="best-practices-grid">
            <div className="practice-item">
              <strong>Stay Calm</strong>
              <p>Your calm demeanor helps. Use slow, steady voice and movements.</p>
            </div>
            <div className="practice-item">
              <strong>Give Space</strong>
              <p>Physical distance often helps. Don't crowd or corner.</p>
            </div>
            <div className="practice-item">
              <strong>Minimize Language</strong>
              <p>Use short, simple phrases. Avoid lengthy explanations or questions.</p>
            </div>
            <div className="practice-item">
              <strong>Reduce Demands</strong>
              <p>Remove expectations temporarily. Focus only on safety.</p>
            </div>
            <div className="practice-item">
              <strong>Offer Choices</strong>
              <p>"Do you want to sit here or over there?" Limited options provide control.</p>
            </div>
            <div className="practice-item">
              <strong>Don't Take It Personally</strong>
              <p>Behaviors are communication, not intentional defiance.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="builder-actions">
        <button className="btn btn-primary">
          <FileText size={20} />
          Print Protocol
        </button>
        <button className="btn btn-secondary">
          <Share2 size={20} />
          Share with Leaders
        </button>
      </div>
    </div>
  );
}
