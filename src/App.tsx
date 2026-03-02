import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { MenuProvider } from '@/context/MenuContext';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import SoftwareList from '@/pages/SoftwareList';
import Courses from '@/pages/Courses';
import PrivateCourses from '@/pages/PrivateCourses';
import Portfolio from '@/pages/Portfolio';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// New Pages
import Store from '@/pages/Store';
import Dashboard from '@/pages/Dashboard';
import RevitFiles from '@/pages/RevitFiles';
import Resources from '@/pages/Resources';
import Blog from '@/pages/Blog';
import ProductDetail from '@/pages/ProductDetail';

// Components
import { ScrollToTop } from '@/components/layout/ScrollToTop';

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

            {/* Dashboard route without MainLayout */}

            {/* Main routes with MainLayout */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/software" element={<SoftwareList />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/private-courses" element={<PrivateCourses />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/store/:category" element={<Store />} />
                    <Route path="community/revit-files" element={<RevitFiles />} />
                    <Route path="community/resources" element={<Resources />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<Blog />} />
                    <Route path="/store/product/:slug" element={<ProductDetail />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
