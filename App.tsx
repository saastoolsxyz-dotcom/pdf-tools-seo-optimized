
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Tools from './pages/Tools';
import Contact from './pages/Contact';
import CookiePolicy from './pages/CookiePolicy';
import Gdpr from './pages/Gdpr';
import Blog from './pages/Blog';
import Careers from './pages/Careers';

// Tool Pages
import TextToPdfTool from './pages/tools/TextToPdf';
import MergePdfTool from './pages/tools/MergePdf';
import SplitPdfTool from './pages/tools/SplitPdf';
import CompressPdfTool from './pages/tools/CompressPdf';
import EditPdfTool from './pages/tools/EditPdf';
import PdfToWordTool from './pages/tools/PdfToWord';
import WordToPdfTool from './pages/tools/WordToPdf';
import JpgToPdfTool from './pages/tools/JpgToPdf';
import SignPdfTool from './pages/tools/SignPdf';
import UnlockPdfTool from './pages/tools/UnlockPdf';
import ProtectPdfTool from './pages/tools/ProtectPdf';
import OrganizePdfTool from './pages/tools/OrganizePdf';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/gdpr" element={<Gdpr />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/tools" element={<Tools />} />
          
          {/* Detailed Tool Routes */}
          <Route path="/tools/text-to-pdf" element={<TextToPdfTool />} />
          <Route path="/tools/merge-pdf" element={<MergePdfTool />} />
          <Route path="/tools/split-pdf" element={<SplitPdfTool />} />
          <Route path="/tools/compress-pdf" element={<CompressPdfTool />} />
          <Route path="/tools/edit-pdf" element={<EditPdfTool />} />
          <Route path="/tools/pdf-to-word" element={<PdfToWordTool />} />
          <Route path="/tools/word-to-pdf" element={<WordToPdfTool />} />
          <Route path="/tools/jpg-to-pdf" element={<JpgToPdfTool />} />
          <Route path="/tools/sign-pdf" element={<SignPdfTool />} />
          <Route path="/tools/unlock-pdf" element={<UnlockPdfTool />} />
          <Route path="/tools/protect-pdf" element={<ProtectPdfTool />} />
          <Route path="/tools/organize-pdf" element={<OrganizePdfTool />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
