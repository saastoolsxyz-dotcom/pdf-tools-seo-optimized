
import React from 'react';
import { Shield, EyeOff, Lock, Server, Mail } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Security First
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last Updated: January 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          <section className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Our Privacy Pledge</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At TextToPDF.online, founded by <strong>Abdullah Dogar</strong>, your privacy is our most sacred priority. We believe that your documents belong to you and nobody else. Our architecture is designed to process files without ever "knowing" what is inside them.
              </p>
            </div>
          </section>

          <section className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Zero-Retention Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not store your uploaded files. All processing occurs in a volatile memory environment. Once your file is converted and downloaded, or after 1 hour of inactivity, it is permanently purged from our servers using automated scripts.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-4">
                <li>No file logging or indexing.</li>
                <li>No manual access by staff members.</li>
                <li>Automated deletion after 60 minutes.</li>
              </ul>
            </div>
          </section>

          <section className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are a "no-account" platform. You don't need to sign up to use our tools. We only collect anonymous technical metadata to improve site performance:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-slate-900 block mb-1">Device Data</span>
                  <span className="text-sm text-gray-500">Browser type, OS, and language.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-slate-900 block mb-1">Usage Stats</span>
                  <span className="text-sm text-gray-500">Pages visited and duration.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Security Measures</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use industry-standard SSL (Secure Sockets Layer) encryption to protect your data during transit. This ensures that your files are safe from interception while being uploaded to our conversion engine.
              </p>
            </div>
          </section>

          <div className="p-8 bg-red-50 rounded-3xl border border-red-100 mt-12">
            <div className="flex items-center space-x-4 mb-4">
              <Mail className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-red-900">Privacy Concerns?</h3>
            </div>
            <p className="text-red-800">
              If you have any questions regarding how your data is handled, please contact Abdullah Dogar directly at <a href="mailto:texttopdf.online@gmail.com" className="font-bold underline">texttopdf.online@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
