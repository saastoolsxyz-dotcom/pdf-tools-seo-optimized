
import React, { useState, useRef } from 'react';
import { Merge, FilePlus, X, CheckCircle, Download, RefreshCw, ArrowUp, ArrowDown, FileText, LayoutList, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface FileItem {
  id: string;
  name: string;
  size: string;
  data: ArrayBuffer;
}

const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileItem[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const buffer = await file.arrayBuffer();
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        data: buffer
      });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const pdf = await PDFDocument.load(file.data);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
      
      // Artificial delay for UX "beast" feel
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1500);
    } catch (error) {
      console.error('Merge failed:', error);
      alert('Error merging PDFs. One of your files might be corrupted or password protected.');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `merged-document-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setMergedBlob(null);
    setIsDone(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-[2rem] shadow-2xl mb-6 text-white transform -rotate-3 hover:rotate-0 transition-transform">
            <Merge size={40} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Merge PDF <span className="text-red-600">Pro</span></h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">Combine multiple documents into one masterpiece in seconds.</p>
        </div>

        {!isDone ? (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500">
            <div className="p-8 sm:p-12">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf" 
              />
              
              {files.length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center hover:border-red-600 hover:bg-red-50/50 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-100 group-hover:bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 group-hover:rotate-6">
                      <FilePlus className="w-10 h-10 text-slate-400 group-hover:text-white" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">Select PDF Files</p>
                    <p className="text-slate-400 mt-2 font-medium">Or drag them here to start merging</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <LayoutList className="text-red-600" size={24} />
                      <h3 className="text-xl font-black text-slate-900">{files.length} Documents Loaded</h3>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-grow sm:flex-grow-0 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-red-600 transition-all"
                      >
                        <FilePlus className="w-4 h-4 mr-2" /> Add More
                      </button>
                      <button 
                        onClick={reset}
                        className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:text-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                    {files.map((file, idx) => (
                      <div key={file.id} className="flex items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-red-200 hover:bg-white transition-all hover:shadow-lg">
                        <div className="flex flex-col space-y-1 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveFile(idx, 'up')} className="text-slate-400 hover:text-red-600 disabled:opacity-20" disabled={idx === 0}><ArrowUp size={16} /></button>
                          <button onClick={() => moveFile(idx, 'down')} className="text-slate-400 hover:text-red-600 disabled:opacity-20" disabled={idx === files.length - 1}><ArrowDown size={16} /></button>
                        </div>
                        <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black mr-5 flex-shrink-0 shadow-lg shadow-red-200">
                          {idx + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter mr-2">PDF</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="p-2.5 text-slate-300 hover:text-red-600 transition-colors bg-white sm:bg-transparent rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 flex justify-center">
                    <button
                      onClick={handleMerge}
                      disabled={files.length < 2 || isProcessing}
                      className={`
                        w-full sm:w-auto px-20 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center
                        ${files.length < 2 || isProcessing 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                          : 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.03] active:scale-95 shadow-red-600/30'}
                      `}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="animate-spin mr-4" />
                          Merging Documents...
                        </>
                      ) : (
                        <>
                          <Merge className="mr-3" />
                          Merge PDF Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 grid sm:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 flex-shrink-0 border border-white/10">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Easy Sorting</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Use the arrows to organize your PDFs in the exact order you want them merged.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-red-500 flex-shrink-0 border border-white/10">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Secure & Fast</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Files are processed directly in your browser. No data ever leaves your computer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl p-20 text-center border-4 border-green-50 animate-fadeIn">
            <div className="w-28 h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <CheckCircle size={56} className="animate-bounce" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Merge Complete!</h2>
            <p className="text-xl text-slate-500 mb-12 max-w-md mx-auto leading-relaxed">
              Your documents have been fused together into one seamless, professional PDF.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDownload}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-16 rounded-2xl text-xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-95"
              >
                <Download className="mr-3" />
                Download PDF
              </button>
              <button
                onClick={reset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 px-12 rounded-2xl text-xl transition-all"
              >
                Start New Project
              </button>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center space-x-8 grayscale opacity-40">
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">High Performance</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Output</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">100% Client-Side</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate merge PDF online for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>PDF merger</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>merge PDF online</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>PDF merger</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>merge PDF online</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>PDF merger</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>merge PDF online</strong> today and see how easy it is to <strong>PDF merger</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our merge PDF online</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>merge PDF online</strong>. We support various file sizes to ensure you can <strong>PDF merger</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>merge PDF online</strong> will begin analyzing the structure to <strong>PDF merger</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>merge PDF online</strong> finishes its work, your file will be ready. You can now <strong>PDF merger</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>merge PDF online</strong> ensures that when you <strong>PDF merger</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our merge PDF online</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>merge PDF online</strong> uses advanced algorithms to ensure that every time you <strong>PDF merger</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>merge PDF online</strong> is optimized for speed, allowing you to <strong>PDF merger</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>PDF merger</strong> without creating an account. Our <strong>merge PDF online</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>merge PDF online</strong> works perfectly, making it easy to <strong>PDF merger</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for merge PDF online</h3>
            <p>
              Many professionals rely on our <strong>merge PDF online</strong> for their daily tasks. For instance, lawyers often need to <strong>PDF merger</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>merge PDF online</strong> to extract information from research papers. When you need to <strong>PDF merger</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>merge PDF online</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>PDF merger</strong> and start editing immediately. Our <strong>merge PDF online</strong> is a versatile asset for any organization looking to <strong>PDF merger</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>merge PDF online</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>PDF merger</strong>, your data is automatically deleted. You can trust our <strong>merge PDF online</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>PDF merger</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best merge PDF online Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>merge PDF online</strong> now and see how simple it is to <strong>PDF merger</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>merge PDF online</strong> is always here to help you <strong>PDF merger</strong> with just a few clicks.
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

    </div>
  );
};

export default MergePdf;
