
import React from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = [
    {
      title: "How to Convert Large Text Files to PDF Efficiently",
      excerpt: "Learn the best practices for handling massive text documents and converting them to professional PDFs without losing formatting.",
      date: "May 15, 2024",
      author: "Abdullah Dogar",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Why PDF Security is Critical for Your Business Documents",
      excerpt: "Discover the top vulnerabilities in digital documents and how our password protection tool keeps your data safe.",
      date: "May 10, 2024",
      author: "Abdullah Dogar",
      category: "Security",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "The Future of Document Management in 2025",
      excerpt: "Exploring upcoming trends in digital paperless offices and how online tools are leading the revolution.",
      date: "May 05, 2024",
      author: "Abdullah Dogar",
      category: "Trends",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "PDF vs. Word: When to Use Which Format?",
      excerpt: "A comprehensive guide on choosing the right file format for your reports, resumes, and legal contracts.",
      date: "April 28, 2024",
      author: "Abdullah Dogar",
      category: "Guide",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "5 Tips to Compress Your PDFs Without Quality Loss",
      excerpt: "Struggling with email attachment limits? Use these professional techniques to shrink your file sizes.",
      date: "April 20, 2024",
      author: "Abdullah Dogar",
      category: "Productivity",
      image: "https://images.unsplash.com/photo-1451187534963-11d9540e6582?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Digital Signatures: Everything You Need to Know",
      excerpt: "Moving beyond physical signatures. Learn the legal and practical aspects of signing PDFs online.",
      date: "April 15, 2024",
      author: "Abdullah Dogar",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Why We Created a 100% Free PDF Tool Platform",
      excerpt: "The vision behind TextToPDF.online and our commitment to providing premium tools at zero cost.",
      date: "April 10, 2024",
      author: "Abdullah Dogar",
      category: "Company",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Managing Large PDF Libraries for Students",
      excerpt: "Tips for students on organizing lecture notes, research papers, and assignments using our tools.",
      date: "April 02, 2024",
      author: "Abdullah Dogar",
      category: "Education",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Understanding PDF Accessibility (WCAG Compliance)",
      excerpt: "Making your documents accessible to everyone. Why it matters and how to implement it.",
      date: "March 25, 2024",
      author: "Abdullah Dogar",
      category: "Accessibility",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Top 10 PDF Hacks Every Professional Should Know",
      excerpt: "Boost your workflow with these expert shortcuts and hidden features in document management.",
      date: "March 18, 2024",
      author: "Abdullah Dogar",
      category: "Workflow",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <BookOpen className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-black mb-4">The <span className="text-red-600">PDF Hub</span> Blog</h1>
          <p className="text-xl text-slate-400">Insights, tutorials, and tips from the world of digital documents.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author}
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="flex items-center text-red-600 font-bold text-sm hover:text-red-700 transition-colors">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Don't Miss an Update</h2>
          <p className="text-red-100 mb-8">Join our newsletter to receive the latest PDF tips and product announcements.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-grow px-6 py-4 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
