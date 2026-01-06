
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Merge, 
  Scissors, 
  Minimize, 
  Edit3, 
  Lock, 
  RefreshCcw, 
  Signature,
  Zap,
  Shield,
  Smartphone,
  Heart,
  ChevronDown
} from 'lucide-react';
import { FaqItem } from '../types';

const Home: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const tools = [
    { name: 'Text to PDF', desc: 'Convert plain text files to PDF format instantly', icon: <FileText className="w-6 h-6 text-white" />, path: '/tools/text-to-pdf' },
    { name: 'Merge PDF', desc: 'Combine multiple PDF files into one document', icon: <Merge className="w-6 h-6 text-white" />, path: '/tools/merge-pdf' },
    { name: 'Split PDF', desc: 'Extract pages or split PDF into multiple files', icon: <Scissors className="w-6 h-6 text-white" />, path: '/tools/split-pdf' },
    { name: 'Compress PDF', desc: 'Reduce PDF file size without losing quality', icon: <Minimize className="w-6 h-6 text-white" />, path: '/tools/compress-pdf' },
    { name: 'Edit PDF', desc: 'Add text, images, and annotations to PDFs', icon: <Edit3 className="w-6 h-6 text-white" />, path: '/tools/edit-pdf' },
    { name: 'Protect PDF', desc: 'Add password protection to your documents', icon: <Lock className="w-6 h-6 text-white" />, path: '/tools/protect-pdf' },
    { name: 'Convert PDF', desc: 'Convert PDF to Word, Excel, and more', icon: <RefreshCcw className="w-6 h-6 text-white" />, path: '/tools/pdf-to-word' },
    { name: 'Sign PDF', desc: 'Add electronic signatures to your documents', icon: <Signature className="w-6 h-6 text-white" />, path: '/tools/sign-pdf' },
  ];

  const faqs: FaqItem[] = [
    { question: 'Is texttopdf.online really free?', answer: 'Yes, texttopdf.online is a completely free text to pdf tool. You can use our online pdf editor without any hidden charges, subscriptions, or daily limits.' },
    { question: 'How secure is my data?', answer: 'Your privacy is our top priority. All conversions happen securely, and files are processed with encrypted connections. We never store, view, or share your data.' },
    { question: 'What file formats are supported?', answer: 'Our tools support various formats including TXT, DOC, DOCX, RTF, HTML, and more for conversion to PDF.' },
    { question: 'Is there any file size limit?', answer: 'To ensure fast performance, texttopdf.online allows files up to 100MB per conversion. For most text documents, this limit is more than enough.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left z-10">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-tight mb-6">
                Free Online <span className="text-red-600">PDF Tools</span><br className="hidden md:block" /> 
                Edit, Convert & Compress Your Files Instantly
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Transform your workflow with professional PDF tools — edit, convert, merge, compress, and split PDFs online. Fast, secure, and completely free. No signup required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/tools" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg text-center">
                  Get Started for Free
                </Link>
                <Link to="/tools/text-to-pdf" className="border-2 border-red-600 hover:border-red-500 text-red-600 hover:text-red-500 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 text-center">
                  Try Text to PDF
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-red-600/10 rounded-full blur-[120px] scale-125"></div>
              <img 
                src="https://i.ibb.co/b5sTZDLH/hero-main-9df00a54d85e4c1e856fd47adf596055.webp" 
                alt="Professional PDF Tools Illustration" 
                className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl relative drop-shadow-2xl animate-float transition-transform hover:scale-105 duration-500 cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="tools">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">PDF Tools Collection</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to work with PDF files. Convert, merge, split, compress, and edit your documents with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {tools.map((tool, idx) => (
              <Link key={idx} to={tool.path} className="bg-gray-50 border border-red-100 rounded-xl p-6 hover:border-red-600 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-700 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
             <img src="https://i.ibb.co/7d8nr94L/IMG-20260105-181331.jpg" alt="Comprehensive PDF Tools Overview" className="w-full max-w-4xl mx-auto rounded-2xl shadow-md border border-gray-100" />
          </div>
        </div>
      </section>

      {/* Features Section (Why Choose Us) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Discover the benefits of using our professional-grade PDF management tools.</p>
          </div>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Lightning Fast Processing</h3>
                  <p className="text-gray-700">Convert your files in seconds with our optimized processing engine. No waiting, no delays.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">100% Secure & Private</h3>
                  <p className="text-gray-700">Your files are processed securely and automatically deleted after conversion. Complete privacy guaranteed.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Works on Any Device</h3>
                  <p className="text-gray-700">Access our tools from desktop, tablet, or mobile. No software installation required.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Completely Free</h3>
                  <p className="text-gray-700">All our PDF tools are free to use with no hidden costs, registration, or watermarks.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-red-600 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">10M+</div>
                <p className="text-gray-700">Files Converted</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">99.9%</div>
                <p className="text-gray-700">Uptime Guarantee</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                <p className="text-gray-700">File Formats Supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Requested Image Section (Below Why Choose Us) */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img 
            src="https://i.ibb.co/ksKMXYjn/IMG-20260105-181944.jpg" 
            alt="Additional PDF Features and Benefits" 
            className="w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-100 transform transition-all hover:scale-[1.01]" 
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black sm:text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700">Get answers to common questions about our PDF conversion tools.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-red-200 rounded-lg bg-gray-50 overflow-hidden transition-all duration-200">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-red-50 focus:outline-none"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <span className="text-lg font-medium text-black">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-red-600 transform transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-4 animate-fadeIn">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-red-900">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/cta/1600/900" alt="CTA BG" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">Ready to Convert Your Files?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust TextToPDF.online for fast, secure, and reliable PDF conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/tools" className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Start Converting Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
