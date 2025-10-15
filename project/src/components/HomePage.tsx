import React from 'react';
import { Heart, MapPin, Sparkles, Shield, ClipboardList, Wrench, Navigation2, CheckCircle, Users, Star, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { currentColors } = useTheme();
  const { user } = useAuth();

  const quickActions = [
    {
      id: 'disabilities',
      title: 'Autism & Disability Support',
      description: 'Sensory profiles, meltdown tracking, calm plans, and specialized resources',
      icon: Heart,
    },
    {
      id: 'tools',
      title: '47 Accessibility Tools',
      description: 'Visual schedules, communication boards, sensory kits, and more',
      icon: Wrench,
    },
    {
      id: 'locations',
      title: 'Accessible Locations',
      description: 'Find Scout camps with detailed accessibility information and reviews',
      icon: Navigation2,
    },
    {
      id: 'planning',
      title: 'Leader Planning',
      description: 'Plan inclusive meetings, campouts, and track Scout progress',
      icon: ClipboardList,
    },
  ];

  const features = [
    {
      icon: Wrench,
      title: '47 Interactive Tools',
      description: 'Visual schedules, communication boards, breathing exercises, sensory trackers',
    },
    {
      icon: MapPin,
      title: 'Location Directory',
      description: 'Accessible Scout camps across Michigan with reviews and photos',
    },
    {
      icon: Heart,
      title: 'Autism Support',
      description: 'Sensory profiles, meltdown tracking, calm plans, emergency protocols',
    },
    {
      icon: ClipboardList,
      title: 'Planning Tools',
      description: 'Meeting planner, campout organizer, calendar, printable forms',
    },
    {
      icon: Users,
      title: 'Scout Profiles',
      description: 'Track accommodations, progress, and individual needs',
    },
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'Bank-level security with row-level access control',
    },
  ];

  const stats = [
    { number: '47', label: 'Accessibility Tools', icon: Wrench },
    { number: '8+', label: 'Michigan Camps', icon: MapPin },
    { number: '7', label: 'Disability Types', icon: Heart },
    { number: '100%', label: 'Free & Open Source', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentColors.background }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <div className="border-2 rounded-xl p-4 mb-8 shadow-sm" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: currentColors.primary }} />
            <p className="text-sm leading-relaxed" style={{ color: currentColors.text }}>
              <strong>Independent Resource:</strong> Scout Inclusion Hub is a volunteer-created platform not affiliated
              with Scouting America. Information is for educational purposes only. Always consult qualified professionals
              and your local council.
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm" style={{ backgroundColor: currentColors.accent + '20', color: currentColors.accent }}>
            <Zap className="w-4 h-4" />
            100% Free • Open Source • Community-Driven
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ color: currentColors.text }}>
            Every Scout Deserves<br />
            <span style={{ color: currentColors.primary }}>
              An Amazing Scouting Experience
            </span>
          </h1>

          <p className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed" style={{ color: currentColors.textMuted }}>
            Complete toolkit for inclusive Scouting with <strong>47 accessibility tools</strong>, Michigan camp directory with reviews,
            autism support resources, planning assistants, and more.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('tools')}
              className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              style={{ backgroundColor: currentColors.primary, color: 'white' }}
            >
              <Wrench className="w-5 h-5" />
              Explore 47 Tools
            </button>
            <button
              onClick={() => onNavigate('locations')}
              className="border-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              style={{ backgroundColor: currentColors.surface, color: currentColors.text, borderColor: currentColors.border }}
            >
              <Navigation2 className="w-5 h-5" />
              Find Accessible Camps
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="border-2 rounded-xl p-6 text-center shadow-sm" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
                <Icon className="w-10 h-10 mx-auto mb-3" style={{ color: currentColors.primary }} />
                <div className="text-4xl font-black mb-1" style={{ color: currentColors.primary }}>{stat.number}</div>
                <div className="text-sm font-semibold" style={{ color: currentColors.text }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-3" style={{ color: currentColors.text }}>Start Here</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: currentColors.textMuted }}>
              Everything you need for Scouts with autism, ADHD, sensory differences, and physical disabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="border-2 rounded-2xl p-6 text-left hover:shadow-xl transform hover:-translate-y-1 transition-all group"
                  style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: currentColors.primary }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 transition-colors" style={{ color: currentColors.text }}>
                        {action.title}
                      </h3>
                      <p className="leading-relaxed" style={{ color: currentColors.textMuted }}>{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-3" style={{ color: currentColors.text }}>Complete Inclusion Toolkit</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: currentColors.textMuted }}>
              Comprehensive resources designed for Scouts with disabilities and special needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="border-2 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: currentColors.surface }}>
                      <Icon className="w-6 h-6" style={{ color: currentColors.primary }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: currentColors.text }}>{feature.title}</h3>
                  </div>
                  <p className="leading-relaxed" style={{ color: currentColors.textMuted }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 md:p-12 text-center shadow-xl mb-8" style={{ backgroundColor: currentColors.primary }}>
          <Star className="w-16 h-16 mx-auto mb-4" style={{ color: currentColors.accent }} />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Make Scouting Accessible?
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto" style={{ color: 'white', opacity: 0.9 }}>
            Join leaders across Michigan using these tools to create inclusive Scouting experiences
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!user ? (
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                style={{ backgroundColor: 'white', color: currentColors.primary }}
              >
                <CheckCircle className="w-5 h-5" />
                Create Free Account
              </button>
            ) : (
              <button
                onClick={() => onNavigate('tools')}
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                style={{ backgroundColor: 'white', color: currentColors.primary }}
              >
                <Wrench className="w-5 h-5" />
                View Tools
              </button>
            )}
            <button
              onClick={() => onNavigate('disabilities')}
              className="border-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              style={{ backgroundColor: currentColors.secondary, color: 'white', borderColor: 'white' }}
            >
              <Heart className="w-5 h-5" />
              Browse Resources
            </button>
          </div>
        </div>

        {/* About */}
        <div className="border-2 rounded-xl p-6 shadow-sm" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: currentColors.accent }} />
            <div>
              <h3 className="text-xl font-bold mb-3" style={{ color: currentColors.text }}>About Scout Inclusion Hub</h3>
              <p className="leading-relaxed mb-4" style={{ color: currentColors.textMuted }}>
                This platform provides practical tools and resources to help Scouts with disabilities, health conditions,
                and special needs participate fully in Scouting. Whether you're a parent preparing for your first campout
                or a leader adapting activities, we're here to help make Scouting accessible for everyone.
              </p>
              <div className="border-2 rounded-lg p-4" style={{ backgroundColor: currentColors.surface, borderColor: currentColors.border }}>
                <p className="text-sm leading-relaxed" style={{ color: currentColors.text }}>
                  <strong style={{ color: currentColors.accent }}>Important:</strong> Scout Inclusion Hub is an independent,
                  community-driven resource created by volunteers. This platform is not affiliated with, endorsed by,
                  or officially connected to Scouting America. Always consult qualified professionals and your local
                  council for official guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
