
import React, { useState, useRef } from 'react';
import { 
  LayoutGrid, FilePlus, Download, CheckCircle, 
  Trash2, ArrowLeft, RefreshCw, RotateCw, 
  Copy, ArrowUp, ArrowDown, FileText, 
  Sparkles, ShieldCheck, GripVertical, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument, degrees } from 'pdf-lib';

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
}

const OrganizePdf: React.FC = () => {
  const [file, setFile] = useState<{ name: string, data: ArrayBuffer, size: string } | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [organizedBlob, setOrganizedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pageCount = pdf.getPageCount();

      const initialPages: PageItem[] = Array.from({ length: pageCount }).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        originalIndex: i,
        rotation: 0
      }));

      setFile({
        name: selectedFile.name,
        data: buffer,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
      setPages(initialPages);
      setError(null);
      setIsDone(false);
    } catch (err) {
      setError("This PDF is encrypted or corrupted. Please unlock it first.");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newPages = [...pages];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    [newPages[index], newPages[target]] = [newPages[target], newPages[index]];
    setPages(newPages);
  };

  const rotatePage = (index: number) => {
    const newPages = [...pages];
    newPages[index].rotation = (newPages[index].rotation + 90) % 360;
    setPages(newPages);
  };

  const duplicatePage = (index: number) => {
    const newPages = [...pages];
    const pageToDup = { ...newPages[index], id: Math.random().toString(36).substr(2, 9) };
    newPages.splice(index + 1, 0, pageToDup);
    setPages(newPages);
  };

  const removePage = (index: number) => {
    if (pages.length <= 1) {
      setError("A PDF must have at least one page.");
      return;
    }
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleOrganize = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const srcDoc = await PDFDocument.load(file.data);
      const outDoc = await PDFDocument.create();

      for (const pageItem of pages) {
        const [copiedPage] = await outDoc.copyPages(srcDoc, [pageItem.originalIndex]);
        copiedPage.setRotation(degrees(pageItem.rotation));
        outDoc.addPage(copiedPage);
      }

      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setOrganizedBlob(blob);

      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Critical error during document reconstruction.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!organizedBlob) return;
    const url = URL.createObjectURL(organizedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organized-${file?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setIsDone(false);
    setError(null);
    setOrganizedBlob(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Studio Header */}
      <div className="bg-white border-b-2 border-red-600 px-6 py-4 flex items-center justify-between sticky top-16 z-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/tools" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase leading-none">Organize PDF</h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest tracking-[0.2em]">Page Architecture Studio</span>
            </div>
          </div>
        </div>
        
        {file && !isDone && (
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">{pages.length} Pages Scheduled</span>
            <button
              onClick={handleOrganize}
              disabled={isProcessing}
              className={`
                flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
                ${isProcessing 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
              `}
            >
              {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Sparkles className="mr-2 w-4 h-4" />}
              Save & Export
            </button>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col items-center py-12 px-4 w-full">
        {!isDone ? (
          <div className="w-full max-w-6xl">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            
            {!file ? (
              <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-200 rounded-[3rem] m-8 p-24 text-center hover:border-red-600 hover:bg-red-50/50 transition-all cursor-pointer group relative"
                >
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-slate-50 group-hover:bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:scale-110 group-hover:rotate-12 shadow-sm">
                      <FilePlus className="w-12 h-12 text-slate-300 group-hover:text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">Select PDF Document</p>
                    <p className="text-slate-500 mt-2 font-medium">Reorder, Rotate, or Duplicate Pages Visually</p>
                    {error && <p className="mt-6 text-red-600 font-bold text-sm bg-red-50 py-2 px-4 rounded-full inline-block">{error}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-fadeIn">
                {/* File Info Bar */}
                <div className="flex items-center bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mr-6 shadow-xl shadow-red-200">
                    <FileText size={28} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg font-black text-slate-900 truncate max-w-sm sm:max-w-md">{file.name}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest tracking-tighter">Live Session</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                    </div>
                  </div>
                  <button onClick={reset} className="p-4 text-slate-300 hover:text-red-600 transition-colors bg-white rounded-2xl shadow-sm"><Trash2 size={24} /></button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 animate-shake">
                    <AlertCircle className="text-red-600" size={18} />
                    <p className="text-xs font-bold text-red-800">{error}</p>
                  </div>
                )}

                {/* Page Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-32">
                  {pages.map((page, idx) => (
                    <div 
                      key={page.id}
                      className="group relative bg-white rounded-3xl border-2 border-slate-200 hover:border-red-600 shadow-sm hover:shadow-2xl hover:scale-105 transition-all p-4 flex flex-col"
                    >
                      {/* Page Counter */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl z-20">
                        {idx + 1}
                      </div>

                      {/* Floating Actions */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <button onClick={() => rotatePage(idx)} className="p-2 bg-white text-slate-600 hover:text-red-600 rounded-xl shadow-lg border border-slate-100"><RotateCw size={16} /></button>
                        <button onClick={() => duplicatePage(idx)} className="p-2 bg-white text-slate-600 hover:text-red-600 rounded-xl shadow-lg border border-slate-100"><Copy size={16} /></button>
                        <button onClick={() => removePage(idx)} className="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-xl shadow-lg border border-slate-100"><Trash2 size={16} /></button>
                      </div>

                      {/* Thumbnail Placeholder */}
                      <div className="flex-grow aspect-[1/1.414] bg-slate-50 rounded-2xl mb-4 flex flex-col items-center justify-center border border-slate-100 relative overflow-hidden">
                        <div 
                          className="transition-transform duration-300 flex flex-col items-center" 
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                        >
                          <FileText size={48} className="text-slate-200 mb-2" />
                          <span className="text-[10px] font-black text-slate-300 uppercase">Original Page {page.originalIndex + 1}</span>
                        </div>
                        {page.rotation !== 0 && (
                          <div className="absolute bottom-3 right-3 bg-red-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">
                            {page.rotation}°
                          </div>
                        )}
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => movePage(idx, 'up')}
                          disabled={idx === 0}
                          className="flex-grow flex items-center justify-center p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl disabled:opacity-10 transition-colors"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => movePage(idx, 'down')}
                          disabled={idx === pages.length - 1}
                          className="flex-grow flex items-center justify-center p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl disabled:opacity-10 transition-colors"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Trigger */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[1/1.414] border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-white transition-all group"
                  >
                    <PlusCircle size={32} className="text-slate-200 group-hover:text-red-600 mb-2" />
                    <span className="text-[10px] font-black text-slate-300 uppercase group-hover:text-red-600">Import More</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl p-20 text-center border-4 border-white animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="w-32 h-32 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <ShieldCheck size={64} className="animate-bounce" />
            </div>
            <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Blueprint Ready</h2>
            <p className="text-xl text-slate-500 mb-14 max-w-md mx-auto leading-relaxed font-medium">Your new document structure has been mapped and flattened successfully.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button onClick={handleDownload} className="bg-red-600 hover:bg-red-700 text-white font-black py-6 px-20 rounded-[2rem] text-2xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-95 group">
                <Download className="mr-4 group-hover:animate-bounce" /> Download PDF
              </button>
              <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-6 px-14 rounded-[2rem] text-2xl transition-all">Start New</button>
            </div>
          </div>
        )}
      </div>


      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate organize PDF pages for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>rearrange PDF</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>organize PDF pages</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>rearrange PDF</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>organize PDF pages</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>rearrange PDF</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>organize PDF pages</strong> today and see how easy it is to <strong>rearrange PDF</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our organize PDF pages</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>organize PDF pages</strong>. We support various file sizes to ensure you can <strong>rearrange PDF</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>organize PDF pages</strong> will begin analyzing the structure to <strong>rearrange PDF</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>organize PDF pages</strong> finishes its work, your file will be ready. You can now <strong>rearrange PDF</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>organize PDF pages</strong> ensures that when you <strong>rearrange PDF</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our organize PDF pages</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>organize PDF pages</strong> uses advanced algorithms to ensure that every time you <strong>rearrange PDF</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>organize PDF pages</strong> is optimized for speed, allowing you to <strong>rearrange PDF</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>rearrange PDF</strong> without creating an account. Our <strong>organize PDF pages</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>organize PDF pages</strong> works perfectly, making it easy to <strong>rearrange PDF</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for organize PDF pages</h3>
            <p>
              Many professionals rely on our <strong>organize PDF pages</strong> for their daily tasks. For instance, lawyers often need to <strong>rearrange PDF</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>organize PDF pages</strong> to extract information from research papers. When you need to <strong>rearrange PDF</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>organize PDF pages</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>rearrange PDF</strong> and start editing immediately. Our <strong>organize PDF pages</strong> is a versatile asset for any organization looking to <strong>rearrange PDF</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>organize PDF pages</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>rearrange PDF</strong>, your data is automatically deleted. You can trust our <strong>organize PDF pages</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>rearrange PDF</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best organize PDF pages Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>organize PDF pages</strong> now and see how simple it is to <strong>rearrange PDF</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>organize PDF pages</strong> is always here to help you <strong>rearrange PDF</strong> with just a few clicks.
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

      <footer className="bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest px-8 py-6 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center space-x-12">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            <span>Architect Engine v5.1 Active</span>
          </div>
          <div className="hidden md:block text-slate-600">Live Structural Re-indexing Enabled</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

// Simple icon addition for duplicate
const PlusCircle = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
  </svg>
);

export default OrganizePdf;
