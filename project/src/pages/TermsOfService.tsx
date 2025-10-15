import React from 'react';
import { FileText } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Terms of Service</h1>
          <p className="text-muted">Last Updated: October 11, 2025</p>
        </div>
      </div>

      <div className="section max-w-4xl mx-auto">
        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted">
              By accessing and using Scout Inclusion Hub, you accept and agree to be bound by the
              terms and provisions of this agreement. If you do not agree to these terms, please do
              not use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Platform Description</h2>
            <p className="text-muted mb-2">
              Scout Inclusion Hub is an independent, community-driven resource created by volunteers
              to support inclusive Scouting. This platform:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Is NOT affiliated with, endorsed by, or officially connected to Scouting America</li>
              <li>Provides educational and organizational tools for informational purposes only</li>
              <li>Does NOT provide medical, legal, or professional advice</li>
              <li>Contains user-generated and community-submitted content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. No Medical or Professional Advice</h2>
            <p className="text-muted">
              Information provided on this platform is for organizational and educational purposes
              only. It is not intended as a substitute for professional medical advice, diagnosis, or
              treatment. Always consult qualified healthcare providers, therapists, and other
              professionals regarding your child's specific needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. User-Generated Content</h2>
            <p className="text-muted mb-2">
              This platform may contain content submitted by community members, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Resource recommendations and organization listings</li>
              <li>Tips, strategies, and personal experiences</li>
              <li>Contact information for councils and coordinators</li>
            </ul>
            <p className="text-muted mt-2">
              We do not guarantee the accuracy, completeness, or timeliness of community-submitted
              information. Users should independently verify all information before relying on it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Award Information</h2>
            <p className="text-muted">
              Award descriptions, requirements, and application processes are provided for
              informational purposes and may not reflect current requirements. Always verify award
              criteria with your local council or official Scouting America resources before applying.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Emergency Situations</h2>
            <p className="text-muted">
              In any emergency situation, always call 911 or your local emergency services
              immediately. Emergency protocols provided on this platform are educational guidelines
              and do NOT replace professional emergency response or your organization's established
              emergency procedures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted">
              Scout Inclusion Hub, its creators, and contributors shall not be liable for any direct,
              indirect, incidental, consequential, or punitive damages arising from your use of this
              platform or reliance on any information provided herein.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Data and Privacy</h2>
            <p className="text-muted">
              User data is stored securely and never shared without consent. See our Privacy Policy
              for detailed information about data collection, storage, and usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Intellectual Property</h2>
            <p className="text-muted">
              Content created by Scout Inclusion Hub is provided for non-commercial use in support of
              inclusive Scouting programs. Scouting America trademarks, logos, and official materials
              remain the property of Scouting America.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Changes to Terms</h2>
            <p className="text-muted">
              We reserve the right to modify these terms at any time. Continued use of the platform
              after changes constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">11. Contact</h2>
            <p className="text-muted">
              Questions about these Terms of Service should be directed to the platform
              administrators through the contact methods provided on the site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
