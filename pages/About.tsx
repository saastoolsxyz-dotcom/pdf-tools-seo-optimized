
import React from 'react';
import { Target, Users, ShieldCheck, Heart, Award, Globe, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
            Our Mission is <span className="text-red-500">Simplicity</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            At TextToPDF.online, we believe that high-quality document tools should be accessible to everyone, everywhere, without the high costs or complexity.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-2 rounded-3xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                alt="Abdullah Dogar - Founder" 
                className="w-full h-[500px] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-bold">Abdullah Dogar</h3>
                <p className="text-red-400 font-medium">Founder & Visionary</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Meet the Visionary behind <br/>
              <span className="text-red-600">TextToPDF.online</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Founded by <strong>Abdullah Dogar</strong>, our platform was born out of a simple observation: the digital world is cluttered with overpriced, complex software for tasks that should be effortless.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              "My goal was to create a sanctuary for document management—a place where users can convert, merge, and protect their files in seconds, with complete peace of mind regarding their privacy," says Abdullah.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-4 border-red-600 pl-4">
                <div className="text-3xl font-black text-slate-900">2024</div>
                <p className="text-gray-500 font-medium">Launched Global</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <div className="text-3xl font-black text-slate-900">100%</div>
                <p className="text-gray-500 font-medium">Privacy Focused</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Built on Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We don't just build tools; we build trust. Every line of code is written with the user in mind.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <Zap className="w-12 h-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Speed</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Lightning fast processing engines that respect your time. No queues, no waiting.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <ShieldCheck className="w-12 h-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Absolute Security</h3>
              <p className="text-gray-600 text-sm leading-relaxed">End-to-end encryption for every file. We never store or view your personal data.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <Globe className="w-12 h-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Universal Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Our tools work on any browser and device, from Tokyo to Toronto.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <Award className="w-12 h-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Professional-grade PDFs with perfect formatting, every single time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-4xl font-black mb-2">10M+</div>
            <p className="text-red-100 text-sm font-medium">Files Processed</p>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">50+</div>
            <p className="text-red-100 text-sm font-medium">Power Tools</p>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">24/7</div>
            <p className="text-red-100 text-sm font-medium">Global Uptime</p>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">0$</div>
            <p className="text-red-100 text-sm font-medium">Hidden Fees</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
