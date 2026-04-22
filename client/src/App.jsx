import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ToolLayout from './components/layout/ToolLayout';
import useAuthStore from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';

// Free Interactive Tools (Wellness+ Clone)
import MacroCalculatorPage from './pages/MacroCalculatorPage';
import CalorieCalculatorPage from './pages/CalorieCalculatorPage';
import PersonalityQuizPage from './pages/PersonalityQuizPage';
import WeightLossProductPage from './pages/WeightLossProductPage';
import SupportPage from './pages/SupportPage';
import AboutUsPage from './pages/AboutUsPage';
import ResearchPage from './pages/ResearchPage';
import PressPage from './pages/PressPage';
import CareersPage from './pages/CareersPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import LessonsPage from './pages/LessonsPage';
import WeightTrackerPage from './pages/WeightTrackerPage';
import BMICalculatorPage from './pages/BMICalculatorPage';
import CommunityPage from './pages/CommunityPage';
import FoodColorGuidePage from './pages/FoodColorGuidePage';
import PricingPage from './pages/PricingPage';
import CheckInPage from './pages/CheckInPage';

import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import CoachPage from './pages/CoachPage';
import NutritionDiary from './pages/NutritionDiary';
import NutritionPage from './pages/NutritionPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MealPlannerPage from './pages/MealPlannerPage';
import RoutinePlannerPage from './pages/RoutinePlannerPage';
import CrossSourceDataSyncPage from './pages/CrossSourceDataSyncPage';
import RecipesPage from './pages/RecipesPage';

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-400 animate-pulse" />
        <p className="text-sm text-text-muted animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Guard
function AuthGuard() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but hasn't finished onboarding, force them there
  if (user && !user.onboarding?.completed) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Outlet />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Free Tools - render inside AppLayout when logged in, public navbar when not */}
        <Route element={<ToolLayout />}>
          <Route path="/macro-calculator" element={<MacroCalculatorPage />} />
          <Route path="/calorie-deficit-calculator" element={<CalorieCalculatorPage />} />
          <Route path="/personality-quiz" element={<PersonalityQuizPage />} />
          <Route path="/bmi-calculator" element={<BMICalculatorPage />} />
          <Route path="/food-guide" element={<FoodColorGuidePage />} />
        </Route>
        
        {/* Core Corporate Tabs */}
        <Route path="/weight-loss" element={<WeightLossProductPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />

        <Route path="/pricing" element={<PricingPage />} />

        {/* App routes (protected) */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/meal-planner" element={<MealPlannerPage />} />
            <Route path="/planner" element={<RoutinePlannerPage />} />
            <Route path="/data-sync" element={<CrossSourceDataSyncPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/weight-tracker" element={<WeightTrackerPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/check-in" element={<CheckInPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
