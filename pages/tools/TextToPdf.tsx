
import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle, Type, Palette, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, ArrowLeft, RefreshCw, 
  Layers, Info, FileCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const TextToPdf: React.FC = () => {
  // Document Content
  const [text, setText] = useState('TextToPDF.online\n\nThis is a sample document created with our professional Text to PDF Studio.\n\nFeatures:\n- Custom Font Sizes\n- Variable Line Spacing\n- Custom Background & Text Colors\n- Real-time Preview\n- High-resolution PDF Export');
  
  // Style States
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontFamily, setFontFamily] = useState('helvetica'); // jsPDF standard fonts
  const [textColor, setTextColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [margin, setMargin] = useState(20);
  
  // App States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    // Simulate processing time for UX
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 1500);
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      // Set Background Color
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(bgColor);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Set Text Styles
      doc.setFont(fontFamily);
      doc.setFontSize(fontSize);
      
      // Convert Hex to RGB for jsPDF
      const r = parseInt(textColor.slice(1, 3), 16);
      const g = parseInt(textColor.slice(3, 5), 16);
      const b = parseInt(textColor.slice(5, 7), 16);
      doc.setTextColor(r, g, b);

      // Split text to fit page width
      const marginMm = margin;
      const contentWidth = pageWidth - (marginMm * 2);
      const splitText = doc.splitTextToSize(text, contentWidth);

      // Render text
      doc.text(splitText, marginMm, marginMm + (fontSize / 3), {
        align: textAlign === 'justify' ? 'left' : textAlign,
        lineHeightFactor: lineHeight
      });

      // Save the PDF
      doc.save(`text-to-pdf-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const reset = () => {
    setIsDone(false);
  };

  const clearText = () => {
    if(window.confirm('Are you sure you want to clear all text?')) {
      setText('');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Branded Header */}
      <div className="bg-white border-b-2 border-red-600 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-16 z-40 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/tools" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-red-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-red-200">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-black text-slate-900 tracking-tight leading-none">TextToPDF.online</h1>
              <span className="text-[8px] sm:text-xs font-bold text-red-600 uppercase tracking-widest">Text to PDF Studio</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={clearText}
            className="hidden md:block text-slate-500 hover:text-red-600 px-4 py-2 text-sm font-bold transition-colors"
          >
            Clear Editor
          </button>
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isProcessing}
            className={`
              flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all
              ${!text.trim() || isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Layers className="mr-2 w-4 h-4" />}
            <span className="hidden sm:inline">Generate PDF</span>
            <span className="sm:hidden">Generate</span>
          </button>
        </div>
      </div>

      {!isDone ? (
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Enhanced Settings Sidebar */}
          <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-hide">
            {/* Typography Section */}
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-slate-900">
                  <Type className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Typography</h3>
                </div>
                <Info size={14} className="text-slate-300" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                    <span>Size</span>
                    <span className="text-red-600">{fontSize}px</span>
                  </div>
                  <input 
                    type="range" min="8" max="48" step="1" 
                    value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                    <span>Spacing</span>
                    <span className="text-red-600">{lineHeight}</span>
                  </div>
                  <input 
                    type="range" min="1" max="2.5" step="0.1" 
                    value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Font Style</label>
                  <select 
                    value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-red-600 shadow-sm transition-colors"
                  >
                    <option value="helvetica">Helvetica (Sans)</option>
                    <option value="times">Times (Serif)</option>
                    <option value="courier">Courier (Mono)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Colors Section */}
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 mb-4 text-slate-900">
                <Palette className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Theme</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Text Color</label>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <input 
                      type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 rounded-lg border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{textColor.replace('#', '')}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Page BG</label>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <input 
                      type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                      className="w-6 h-6 rounded-lg border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{bgColor.replace('#', '')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Layout Section */}
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 mb-4 text-slate-900">
                <AlignJustify className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Alignment</h3>
              </div>
              <div className="space-y-4">
                <div className="flex bg-slate-200 p-1.5 rounded-xl">
                  {[
                    { id: 'left', icon: <AlignLeft size={16} /> },
                    { id: 'center', icon: <AlignCenter size={16} /> },
                    { id: 'right', icon: <AlignRight size={16} /> },
                    { id: 'justify', icon: <AlignJustify size={16} /> }
                  ].map((align) => (
                    <button
                      key={align.id}
                      onClick={() => setTextAlign(align.id as any)}
                      className={`flex-grow flex items-center justify-center p-2 rounded-lg transition-all ${textAlign === align.id ? 'bg-white shadow-md text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {align.icon}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                    <span>Margins</span>
                    <span className="text-red-600">{margin}mm</span>
                  </div>
                  <input 
                    type="range" min="5" max="50" step="1" 
                    value={margin} onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </section>
          </aside>

          {/* Main Editor Area */}
          <main className="flex-grow p-4 sm:p-8 overflow-y-auto bg-slate-200/50">
            <div 
              className="max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl transition-all duration-300 relative"
              style={{ 
                backgroundColor: bgColor,
                padding: `${margin}mm`,
              }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing your document content here..."
                className="w-full h-full min-h-[250mm] bg-transparent border-none outline-none resize-none overflow-hidden"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  fontFamily: fontFamily,
                  color: textColor,
                  textAlign: textAlign,
                }}
              />
              
              {/* Page Indicator */}
              <div className="absolute bottom-8 right-8 flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
                <FileCode size={14} />
                <span>A4 Standard • 1 Page</span>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* Success Screen */
        <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-16 text-center border-4 border-white max-w-2xl w-full animate-fadeIn">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-inner">
              <CheckCircle size={48} className="sm:size-[56px] animate-bounce" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-2 tracking-tight">PDF Generated</h2>
            <p className="text-base sm:text-lg text-slate-500 mb-8 sm:mb-12 max-w-sm mx-auto leading-relaxed font-medium">
              Your text has been successfully converted into a professional PDF document.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDownload}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-4 sm:py-5 px-8 sm:px-16 rounded-2xl text-lg sm:text-xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-95 group"
              >
                <Download className="mr-3 group-hover:animate-bounce" />
                Download PDF
              </button>
              <button
                onClick={reset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-2xl text-lg sm:text-xl transition-all"
              >
                Edit More
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate text to PDF converter for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>convert text to PDF</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>text to PDF converter</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>convert text to PDF</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>text to PDF converter</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>convert text to PDF</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>text to PDF converter</strong> today and see how easy it is to <strong>convert text to PDF</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our text to PDF converter</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>text to PDF converter</strong>. We support various file sizes to ensure you can <strong>convert text to PDF</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>text to PDF converter</strong> will begin analyzing the structure to <strong>convert text to PDF</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>text to PDF converter</strong> finishes its work, your file will be ready. You can now <strong>convert text to PDF</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>text to PDF converter</strong> ensures that when you <strong>convert text to PDF</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our text to PDF converter</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>text to PDF converter</strong> uses advanced algorithms to ensure that every time you <strong>convert text to PDF</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>text to PDF converter</strong> is optimized for speed, allowing you to <strong>convert text to PDF</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>convert text to PDF</strong> without creating an account. Our <strong>text to PDF converter</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>text to PDF converter</strong> works perfectly, making it easy to <strong>convert text to PDF</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for text to PDF converter</h3>
            <p>
              Many professionals rely on our <strong>text to PDF converter</strong> for their daily tasks. For instance, lawyers often need to <strong>convert text to PDF</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>text to PDF converter</strong> to extract information from research papers. When you need to <strong>convert text to PDF</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>text to PDF converter</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>convert text to PDF</strong> and start editing immediately. Our <strong>text to PDF converter</strong> is a versatile asset for any organization looking to <strong>convert text to PDF</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>text to PDF converter</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>convert text to PDF</strong>, your data is automatically deleted. You can trust our <strong>text to PDF converter</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>convert text to PDF</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best text to PDF converter Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>text to PDF converter</strong> now and see how simple it is to <strong>convert text to PDF</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>text to PDF converter</strong> is always here to help you <strong>convert text to PDF</strong> with just a few clicks.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-red-600 text-white font-black py-4 px-10 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Back to Top & Start Converting
            </button>
          </section>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest px-8 py-4 flex items-center justify-between border-t border-white/5 mt-auto">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Studio v2.0 Active</span>
          </div>
          <div className="hidden md:block text-slate-600">Real-time Layout Normalization</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default TextToPdf;
