import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AutismSupport } from './pages/AutismSupport';
import { PrintableForms } from './pages/PrintableForms';
import { GamesActivities } from './pages/GamesActivities';
import { ActivityPreview } from './pages/ActivityPreview';
import { FormPreview } from './pages/FormPreview';
import { LeaderDashboard } from './pages/LeaderDashboard';
import { Settings } from './pages/Settings';
import { Awards } from './pages/Awards';
import { CouncilContacts } from './pages/CouncilContacts';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { ResourceDirectory } from './pages/ResourceDirectory';
import { Auth } from './pages/Auth';
import { ScoutProfiles } from './pages/ScoutProfiles';
import { AccessibilityTools } from './pages/AccessibilityTools';
import { AccessibleLocations } from './pages/AccessibleLocations';

function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [previewActivity, setPreviewActivity] = useState<any>(null);
  const [previewForm, setPreviewForm] = useState<any>(null);

  const handleActivityPreview = (activity: any) => {
    setPreviewActivity(activity);
  };

  const handleFormPreview = (form: any) => {
    setPreviewForm(form);
  };

  const handleBackFromActivityPreview = () => {
    setPreviewActivity(null);
  };

  const handleBackFromFormPreview = () => {
    setPreviewForm(null);
  };

  const renderPage = () => {
    if (previewActivity) {
      return <ActivityPreview activity={previewActivity} onBack={handleBackFromActivityPreview} />;
    }

    if (previewForm) {
      return <FormPreview form={previewForm} onBack={handleBackFromFormPreview} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'disabilities':
        return <AutismSupport onNavigate={setCurrentPage} />;
      case 'forms':
        return <PrintableForms onPreview={handleFormPreview} />;
      case 'activities':
        return <GamesActivities onPreview={handleActivityPreview} />;
      case 'planning':
        return <LeaderDashboard />;
      case 'awards':
        return <Awards key="awards" />;
      case 'contacts':
        return <CouncilContacts />;
      case 'tools':
        return <AccessibilityTools />;
      case 'resources':
        return <ResourceDirectory key="resources" />;
      case 'auth':
        return <Auth onSuccess={() => setCurrentPage('home')} />;
      case 'profiles':
        return user ? <ScoutProfiles /> : <Auth onSuccess={() => setCurrentPage('profiles')} />;
      case 'locations':
        return <AccessibleLocations />;
      case 'settings':
        return <Settings />;
      case 'terms':
        return <TermsOfService />;
      case 'privacy':
        return <PrivacyPolicy />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main id="main-content">{renderPage()}</main>
        <Footer onNavigate={setCurrentPage} />
      </div>
    </ThemeProvider>
  );
}

export default App;
