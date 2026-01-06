
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Merge, Scissors, Minimize, Edit3, Lock, RefreshCcw, Signature, 
  Image as ImageIcon, Trash2, LayoutGrid, FileUp, Unlock
} from 'lucide-react';

const Tools: React.FC = () => {
  const toolGroups = [
    {
      title: "Core PDF Tools",
      items: [
        { name: 'Text to PDF', desc: 'Convert text files to PDF', icon: <FileText />, path: '/tools/text-to-pdf' },
        { name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: <Merge />, path: '/tools/merge-pdf' },
        { name: 'Split PDF', desc: 'Separate pages from a PDF', icon: <Scissors />, path: '/tools/split-pdf' },
        { name: 'Compress PDF', desc: 'Reduce PDF file size', icon: <Minimize />, path: '/tools/compress-pdf' },
        { name: 'Edit PDF', desc: 'Add text and shapes to PDFs', icon: <Edit3 />, path: '/tools/edit-pdf' },
        { name: 'PDF to Word', desc: 'Make PDFs editable in Word', icon: <RefreshCcw />, path: '/tools/pdf-to-word' },
      ]
    },
    {
      title: "Conversion & More",
      items: [
        { name: 'Word to PDF', desc: 'Perfect Word to PDF conversion', icon: <FileUp />, path: '/tools/word-to-pdf' },
        { name: 'JPG to PDF', desc: 'Convert images to PDF format', icon: <ImageIcon />, path: '/tools/jpg-to-pdf' },
        { name: 'Sign PDF', desc: 'Sign your PDFs digitally', icon: <Signature />, path: '/tools/sign-pdf' },
        { name: 'Unlock PDF', desc: 'Remove PDF password security', icon: <Unlock />, path: '/tools/unlock-pdf' },
        { name: 'Protect PDF', desc: 'Add password to PDF', icon: <Lock />, path: '/tools/protect-pdf' },
        { name: 'Organize PDF', desc: 'Rearrange PDF pages', icon: <LayoutGrid />, path: '/tools/organize-pdf' },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-black mb-4">All <span className="text-red-600">PDF Tools</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to edit, convert, and manage your PDF files in one place.
          </p>
        </div>

        <div className="space-y-12">
          {toolGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="text-2xl font-bold text-black mb-6 border-l-4 border-red-600 pl-4">{group.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.items.map((tool, idx) => (
                  <Link 
                    key={idx} 
                    to={tool.path} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-600 hover:shadow-lg transition-all duration-200 group flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                      {React.cloneElement(tool.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">{tool.name}</h3>
                    <p className="text-sm text-gray-500">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
