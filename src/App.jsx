import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Legal from './pages/Legal.jsx';
import Pricing from './pages/Pricing.jsx';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
      </Route>
    </Routes>
  </AuthProvider>
);

export default App;
