
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Linkedin, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const logoUrl = "https://i.ibb.co/nsMNRSNr/IMG-20260104-084220.png";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="TextToPDF.online Logo" className="h-10 w-auto mr-2" />
              <span className="text-xl font-black text-black tracking-tight">TextToPDF.online</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    location.pathname === link.path ? 'text-red-600 font-bold' : 'text-gray-700 font-medium'
                  } hover:text-red-600 px-3 py-2 text-sm transition-colors`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/tools"
                className="hidden sm:block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-600/20"
              >
                Get Started Free
              </Link>
              <button
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-red-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/tools"
                className="block px-3 py-2 rounded-md text-base font-black bg-red-600 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <img src={logoUrl} alt="TextToPDF.online Logo" className="h-10 w-auto mr-2 brightness-110" />
                <span className="text-xl font-black">TextToPDF.online</span>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Professional PDF tools for all your document needs. Convert, edit, merge, and manage PDFs online for free. No installation required.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-black mb-6 text-red-500 uppercase text-xs tracking-widest">PDF Tools</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/tools/text-to-pdf" className="text-slate-400 hover:text-white transition-colors">Text to PDF</Link></li>
                <li><Link to="/tools/merge-pdf" className="text-slate-400 hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link to="/tools/split-pdf" className="text-slate-400 hover:text-white transition-colors">Split PDF</Link></li>
                <li><Link to="/tools/compress-pdf" className="text-slate-400 hover:text-white transition-colors">Compress PDF</Link></li>
                <li><Link to="/tools/edit-pdf" className="text-slate-400 hover:text-white transition-colors">Edit PDF</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-black mb-6 text-red-500 uppercase text-xs tracking-widest">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-black mb-6 text-red-500 uppercase text-xs tracking-widest">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/gdpr" className="text-slate-400 hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-xs font-medium">
              © {new Date().getFullYear()} TextToPDF.online. All rights reserved. Created by <span className="text-red-500 font-bold">Abdullah Dogar</span>.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Secure & Private Architecture</span>
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
