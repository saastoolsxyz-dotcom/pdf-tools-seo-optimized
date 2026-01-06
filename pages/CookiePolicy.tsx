
import React from 'react';
import { Cookie, Settings, BarChart, HardDrive } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Cookie Policy</h1>
          <p className="text-slate-400">Understanding how we use small data for big experiences.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you interact with our tools.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Settings className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Essential Cookies</h3>
              <p className="text-sm text-gray-600">
                These are necessary for the website to function. They handle basic tasks like security and site navigation. Without these, the site wouldn't work correctly.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <BarChart className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analytical Cookies</h3>
              <p className="text-sm text-gray-600">
                We use Google Analytics to see which tools are most popular. This helps Abdullah Dogar decide which new features to build next for our users.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center flex-shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Manage Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
              </p>
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-800 text-sm">
                <strong>Note:</strong> Disabling cookies may prevent you from using some of our tools effectively, as your session state may be lost during the conversion process.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
