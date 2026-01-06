
import React from 'react';
import { Scale, AlertTriangle, CheckSquare, XCircle, Globe } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Legal Agreement
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last Updated: January 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-gray-600 mb-12">
            Welcome to TextToPDF.online. By accessing our tools, you agree to comply with the following terms. These terms are designed to ensure a fair and safe experience for all our users.
          </p>

          <div className="space-y-12">
            <section className="flex gap-6">
              <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By using this website, you confirm that you are at least 13 years old and agree to be bound by these Terms of Service. If you are using the service on behalf of an organization, you are agreeing to these terms for that organization.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Prohibited Use</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree not to misuse the services. For example, you must not:
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                  <li className="flex items-center space-x-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    <span>Upload malicious code or viruses.</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    <span>Scrape or bot the service.</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    <span>Bypass file size limits.</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    <span>Use tools for illegal activities.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. No Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. While Abdullah Dogar and the team strive for perfection, we do not guarantee that the service will be uninterrupted, secure, or error-free. You use the service at your own risk.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All software, designs, and content on TextToPDF.online are the property of TextToPDF.online and its founder. You may not copy, modify, or distribute our code without explicit written permission.
                </p>
              </div>
            </section>

            <div className="p-8 bg-slate-900 rounded-3xl text-white text-center mt-12">
              <h3 className="text-xl font-bold mb-4">Questions about our Terms?</h3>
              <p className="text-slate-400 mb-6">We are happy to clarify any points of our agreement.</p>
              <a 
                href="mailto:texttopdf.online@gmail.com" 
                className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-colors"
              >
                Contact Legal Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
