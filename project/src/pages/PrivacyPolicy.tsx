import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Privacy Policy</h1>
          <p className="text-muted">Last Updated: October 11, 2025</p>
        </div>
      </div>

      <div className="section max-w-4xl mx-auto">
        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-2 mt-4">Personal Information You Provide</h3>
            <p className="text-muted mb-2">When you use Scout Inclusion Hub, you may provide:</p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Account information (email address, username)</li>
              <li>Scout profiles (names, disabilities, accommodations, preferences)</li>
              <li>Calm plans and behavior tracking data</li>
              <li>Custom visual schedules and activity plans</li>
              <li>Emergency contact information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Device and browser information</li>
              <li>Usage patterns and feature interactions</li>
              <li>Session data and timestamps</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted mb-2">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Provide personalized disability support tools and resources</li>
              <li>Save and sync your data across devices</li>
              <li>Generate custom calm plans, schedules, and tracking reports</li>
              <li>Improve platform features and user experience</li>
              <li>Send important updates about the platform (if you opt in)</li>
            </ul>
            <p className="text-muted mt-2">
              <strong>We will NEVER:</strong> Sell your personal information, share sensitive data
              with third parties for marketing, or use your data for purposes other than providing
              this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Data Storage and Security</h2>
            <p className="text-muted mb-2">
              Your data is stored securely using industry-standard encryption:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>All data transmitted between your device and our servers is encrypted (HTTPS/TLS)</li>
              <li>Sensitive information is encrypted at rest in our database</li>
              <li>Access to user data is restricted to essential platform operations only</li>
              <li>Regular security audits and updates maintain protection standards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Data Sharing and Privacy Controls</h2>

            <h3 className="text-xl font-semibold mb-2 mt-4">Your Control</h3>
            <p className="text-muted mb-2">
              You have complete control over your data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Choose what information to include in profiles and plans</li>
              <li>Export your data at any time in portable formats</li>
              <li>Delete your account and all associated data</li>
              <li>Share specific documents only with people you trust</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">When We Share Information</h3>
            <p className="text-muted mb-2">
              We only share your information when:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>You explicitly choose to share documents (e.g., export/print calm plans for leaders)</li>
              <li>Required by law or legal process</li>
              <li>Necessary to protect safety in emergency situations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Children's Privacy</h2>
            <p className="text-muted">
              This platform is designed for parents, guardians, and adult leaders to support youth
              in Scouting programs. While the platform stores information about youth, it is intended
              to be managed by adults. We do not knowingly collect information directly from children
              under 13 without parental consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Cookies and Tracking</h2>
            <p className="text-muted mb-2">
              We use essential cookies and local storage to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Maintain your login session</li>
              <li>Remember your preferences and settings</li>
              <li>Store theme and accessibility choices</li>
            </ul>
            <p className="text-muted mt-2">
              We do NOT use third-party advertising cookies or cross-site tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Third-Party Services</h2>
            <p className="text-muted mb-2">
              Scout Inclusion Hub uses the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Supabase - Database and authentication (see Supabase Privacy Policy)</li>
              <li>Hosting provider - For serving the application</li>
            </ul>
            <p className="text-muted mt-2">
              These services are selected for their strong privacy and security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Data Retention</h2>
            <p className="text-muted">
              We retain your data as long as your account is active or as needed to provide services.
              When you delete your account, all personal data is permanently deleted within 30 days.
              Anonymized usage statistics may be retained for platform improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Your Rights</h2>
            <p className="text-muted mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted ml-4">
              <li>Access all personal data we store about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Changes to This Policy</h2>
            <p className="text-muted">
              We may update this Privacy Policy periodically. We will notify users of significant
              changes via email or platform notification. Your continued use after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">11. Contact Us</h2>
            <p className="text-muted">
              Questions or concerns about privacy should be directed to the platform administrators.
              We are committed to addressing privacy concerns promptly and transparently.
            </p>
          </section>
        </div>

        <div className="alert-box alert-info mt-6">
          <Shield size={24} />
          <div>
            <strong>Privacy Commitment:</strong> Your trust is essential. We are committed to
            protecting your privacy and handling your sensitive information with the utmost care and
            respect. If you ever have concerns, please reach out to us.
          </div>
        </div>
      </div>
    </div>
  );
}
