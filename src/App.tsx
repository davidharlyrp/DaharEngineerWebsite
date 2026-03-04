import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { MenuProvider } from '@/context/MenuContext';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import SoftwareList from '@/pages/SoftwareList';
import PrivateCourses from '@/pages/PrivateCourses';
import OnlineCourses from '@/pages/OnlineCourses';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// New Pages
import Store from '@/pages/Store';
import Dashboard from '@/pages/Dashboard';
import RevitFiles from '@/pages/RevitFiles';
import Resources from '@/pages/Resources';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import ProductDetail from '@/pages/ProductDetail';
import FAQ from '@/pages/FAQ';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Refund from '@/pages/Refund';
import CommunityPolicy from '@/pages/CommunityPolicy';
import BuildingDesign from '@/pages/BuildingDesign';
import ConfirmVerification from '@/pages/ConfirmVerification';
import ForgotPassword from '@/pages/ForgotPassword';
import ConfirmPasswordReset from '@/pages/ConfirmPasswordReset';
import PBRedirectHandler from '@/pages/PBRedirectHandler';

// Components
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { AuthGuard } from '@/components/auth/AuthGuard';

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Auth routes without MainLayout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/confirm-password-reset/:token" element={<ConfirmPasswordReset />} />
            <Route path="/auth/confirm-password-reset" element={<ConfirmPasswordReset />} />

            {/* Verification routes */}
            <Route path="/auth/confirm-verification/:token" element={<ConfirmVerification />} />
            <Route path="/_" element={<PBRedirectHandler />} />

            {/* Main routes with MainLayout */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/services" element={<Services />} />
                    <Route path="/building-design" element={<BuildingDesign />} />
                    <Route path="/software" element={<SoftwareList />} />
                    <Route path="/courses/online-courses" element={<OnlineCourses />} />
                    <Route path="/courses/private-courses" element={<PrivateCourses />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/store/:category" element={<Store />} />
                    <Route path="/store/product/:slug" element={<ProductDetail />} />

                    <Route path="/community/revit-files" element={<RevitFiles />} />
                    <Route path="/community/resources" element={<Resources />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />

                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund" element={<Refund />} />
                    <Route path="/community-policy" element={<CommunityPolicy />} />
                  </Routes>
                </MainLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
          </Routes>
        </Router>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
