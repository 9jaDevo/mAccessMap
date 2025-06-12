import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleMapsProvider } from './contexts/GoogleMapsContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonateButton } from './components/DonateButton';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ReviewPage } from './pages/ReviewPage';
import { BadgesPage } from './pages/BadgesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileReviewsPage } from './pages/ProfileReviewsPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { PrivacySettingsPage } from './pages/PrivacySettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { CareersPage } from './pages/CareersPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AccessibilityStatementPage } from './pages/AccessibilityStatementPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { Toaster } from './components/Toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GoogleMapsProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/badges" element={<BadgesPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/reviews" element={<ProfileReviewsPage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/profile/privacy" element={<PrivacySettingsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/accessibility" element={<AccessibilityStatementPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
            <DonateButton />
          </div>
        </GoogleMapsProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;