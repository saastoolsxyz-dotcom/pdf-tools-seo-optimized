
import React from 'react';
import { Flag, Fingerprint, Trash2, Database, Mail } from 'lucide-react';

const Gdpr: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            EU Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">GDPR Commitment</h1>
          <p className="text-slate-400">Empowering European users with full control over their digital footprint.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">GDPR Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                The General Data Protection Regulation (GDPR) is the toughest privacy and security law in the world. Abdullah Dogar and the TextToPDF.online team fully embrace these standards for all users worldwide, not just those in the EU.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 pt-8 border-t border-gray-100">Your Data Rights</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-2xl">
              <Fingerprint className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">Right to Access</h3>
              <p className="text-sm text-gray-500">You can ask what data we have. (Hint: It's usually nothing!)</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <Trash2 className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">Right to Erasure</h3>
              <p className="text-sm text-gray-500">We already delete your files automatically within an hour.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <Database className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">Data Portability</h3>
              <p className="text-sm text-gray-500">Request a copy of your personal data in a readable format.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl">
              <Mail className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">Right to Object</h3>
              <p className="text-sm text-gray-500">Object to our processing of your data at any time.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Data Controller</h3>
            <p className="text-gray-600 mb-6">
              For the purpose of the GDPR, the data controller is <strong>Abdullah Dogar</strong>. If you wish to exercise any of your rights listed above, please send a formal request to our email.
            </p>
            <div className="flex items-center space-x-2 text-red-600 font-bold">
              <Mail className="w-5 h-5" />
              <span>texttopdf.online@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gdpr;
