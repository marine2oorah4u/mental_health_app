import React from 'react';
import { Heart, Shield, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">🏕️</div>
              <h3 className="font-bold text-lg">Scout Inclusion Hub</h3>
            </div>
            <p className="text-sm text-muted">
              An independent, community-driven resource to support inclusive Scouting for all youth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('disabilities')}
                  className="text-muted hover:text-primary transition-colors"
                >
                  Support Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('awards')}
                  className="text-muted hover:text-primary transition-colors"
                >
                  Awards & Recognition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contacts')}
                  className="text-muted hover:text-primary transition-colors"
                >
                  Council Contacts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('settings')}
                  className="text-muted hover:text-primary transition-colors"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal & Privacy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText size={14} />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield size={14} />
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p>
              © 2025 Scout Inclusion Hub. Not affiliated with Scouting America.
            </p>
            <p className="flex items-center gap-2">
              Made with <Heart size={14} className="text-error" /> for inclusive Scouting
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
