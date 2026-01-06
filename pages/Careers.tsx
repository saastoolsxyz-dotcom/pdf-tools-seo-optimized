
import React from 'react';
import { Briefcase, MapPin, Clock, Users, Zap, Heart, Star, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
  const jobs = [
    {
      title: "Senior Full Stack Engineer",
      location: "Remote",
      type: "Full-time",
      dept: "Engineering"
    },
    {
      title: "Product Designer (UI/UX)",
      location: "Remote / Hybrid",
      type: "Full-time",
      dept: "Design"
    },
    {
      title: "Technical Content Writer",
      location: "Remote",
      type: "Part-time",
      dept: "Marketing"
    },
    {
      title: "Customer Success Lead",
      location: "Remote",
      type: "Full-time",
      dept: "Support"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-6">Build the Future of <br/><span className="text-red-600">Digital Paper</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join Abdullah Dogar and a global team of innovators dedicated to making document tools free and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900">Why Work With Us?</h2>
          <p className="text-gray-500 mt-2">We're more than just a tool; we're a mission-driven community.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Remote-First Culture</h3>
            <p className="text-sm text-gray-500">Work from anywhere in the world. We value output over office hours.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">High Impact</h3>
            <p className="text-sm text-gray-500">Your work directly helps millions of users manage their daily documents.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">People First</h3>
            <p className="text-sm text-gray-500">Generous health benefits, learning stipends, and mental wellness support.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Modern Stack</h3>
            <p className="text-sm text-gray-500">We use the latest tech to build performant, secure, and beautiful tools.</p>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-slate-900">Open Positions</h2>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-200 rounded-full text-slate-700 text-sm font-bold">
              {jobs.length} Opportunities
            </div>
          </div>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-red-600 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{job.dept}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{job.title}</h3>
                    <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-slate-400" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-0">
                    <button className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl group-hover:bg-red-600 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-slate-900 rounded-3xl p-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Don't see the right fit?</h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We're always looking for talented individuals. Send your resume and a brief intro to Abdullah Dogar for our future talent pool.
            </p>
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-black transition-colors shadow-lg">
              <Send className="w-5 h-5 mr-2" />
              General Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
