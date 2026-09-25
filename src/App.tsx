import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';

// Public Layout & Pages
import { PublicLayout } from './components/layout/PublicLayout.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ProgramsPage } from './pages/ProgramsPage.tsx';
import { ProgramDetailPage } from './pages/ProgramDetailPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { ImpactPage } from './pages/ImpactPage.tsx';
import { StoriesPage } from './pages/StoriesPage.tsx';
import { StoryDetailPage } from './pages/StoryDetailPage.tsx';
import { NewsPage } from './pages/NewsPage.tsx';
import { NewsDetailPage } from './pages/NewsDetailPage.tsx';
import { EventsPage } from './pages/EventsPage.tsx';
import { EventDetailPage } from './pages/EventDetailPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { GetInvolvedPage } from './pages/GetInvolvedPage.tsx';
import { DonatePage } from './pages/DonatePage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

// Admin Pages
import { AdminRoute } from './admin/AdminRoute.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AdminLoginPage } from './admin/pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage.tsx';
import { AdminProgramsPage } from './admin/pages/AdminProgramsPage.tsx';
import { AdminProjectsPage } from './admin/pages/AdminProjectsPage.tsx';
import { AdminNewsPage } from './admin/pages/AdminNewsPage.tsx';
import { AdminStoriesPage } from './admin/pages/AdminStoriesPage.tsx';
import { AdminEventsPage } from './admin/pages/AdminEventsPage.tsx';
import { AdminGalleryPage } from './admin/pages/AdminGalleryPage.tsx';
import { AdminTeamPage } from './admin/pages/AdminTeamPage.tsx';
import { AdminVolunteersPage } from './admin/pages/AdminVolunteersPage.tsx';
import { AdminDonationsPage } from './admin/pages/AdminDonationsPage.tsx';
import { AdminMessagesPage } from './admin/pages/AdminMessagesPage.tsx';
import { AdminUsersPage } from './admin/pages/AdminUsersPage.tsx';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage.tsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Facing Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/:slug" element={<ProgramDetailPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="impact" element={<ImpactPage />} />
              <Route path="stories" element={<StoriesPage />} />
              <Route path="stories/:slug" element={<StoryDetailPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="get-involved" element={<GetInvolvedPage />} />
              <Route path="donate" element={<DonatePage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="programs" element={<AdminProgramsPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="news" element={<AdminNewsPage />} />
                <Route path="stories" element={<AdminStoriesPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="team" element={<AdminTeamPage />} />
                <Route path="volunteers" element={<AdminVolunteersPage />} />
                <Route path="donations" element={<AdminDonationsPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
