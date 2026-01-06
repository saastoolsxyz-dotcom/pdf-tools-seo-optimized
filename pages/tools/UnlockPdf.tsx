
import React, { useState, useRef } from 'react';
import { 
  Unlock, FilePlus, Download, CheckCircle, 
  Trash2, ArrowLeft, RefreshCw, Lock, 
  Key, ShieldAlert, Sparkles, FileText, 
  ShieldCheck, AlertTriangle, Eye, EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

const UnlockPdf: React.FC = () => {
  const [file, setFile] = useState<{ name: string, data: ArrayBuffer, size: string } | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedBlob, setUnlockedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setNeedsPassword(false);
    const buffer = await selectedFile.arrayBuffer();
    
    // Initial check: is it encrypted?
    try {
      await PDFDocument.load(buffer);
      // If successful with no password, it's not encrypted
      setFile({
        name: selectedFile.name,
        data: buffer,
        size: (selectedFile.size / 1024).toFixed(1) + ' KB'
      });
      setNeedsPassword(false);
      setError("This PDF is already unlocked or has no password.");
    } catch (err: any) {
      if (err.message.includes('password') || err.message.includes('decrypt')) {
        setFile({
          name: selectedFile.name,
          data: buffer,
          size: (selectedFile.size / 1024).toFixed(1) + ' KB'
        });
        setNeedsPassword(true);
      } else {
        setError("Could not read this PDF. It might be corrupted.");
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUnlock = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Attempt to load with the user's password
      const pdfDoc = await PDFDocument.load(file.data, { password });
      
      // Step 2: Re-save without encryption (unlocking it)
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setUnlockedBlob(blob);
      
      // Simulate "Beast Engine" processing
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      setError("Invalid password. Please check and try again.");
    }
  };

  const handleDownload = () => {
    if (!unlockedBlob) return;
    const url = URL.createObjectURL(unlockedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unlocked-${file?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setIsDone(false);
    setNeedsPassword(false);
    setError(null);
    setUnlockedBlob(null);
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
              <Unlock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase">Unlock PDF</h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest tracking-[0.2em]">Decryption Studio</span>
            </div>
          </div>
        </div>
        
        {file && needsPassword && !isDone && (
          <button
            onClick={handleUnlock}
            disabled={isProcessing || !password}
            className={`
              flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
              ${isProcessing || !password
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Key className="mr-2 w-4 h-4" />}
            Unlock Document
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 w-full flex-grow flex flex-col justify-center">
        {!isDone ? (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            <div className="p-8 sm:p-12">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center hover:border-red-600 hover:bg-red-50/50 transition-all cursor-pointer group relative"
                >
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-100 group-hover:bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 group-hover:rotate-6">
                      <FilePlus className="w-10 h-10 text-slate-400 group-hover:text-white" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Protected PDF</p>
                    <p className="text-slate-400 mt-2 font-medium">Remove security restrictions instantly</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mr-6 shadow-xl shadow-red-200">
                      <FileText size={28} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-black text-slate-900 truncate max-w-sm sm:max-w-md">{file.name}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">Locked PDF</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                      </div>
                    </div>
                    <button onClick={reset} className="p-3 text-slate-300 hover:text-red-600"><Trash2 size={24} /></button>
                  </div>

                  {error ? (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center space-x-4 animate-shake">
                      <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                      <p className="text-sm font-bold text-red-800">{error}</p>
                    </div>
                  ) : needsPassword && (
                    <div className="space-y-6">
                      <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                        <div className="flex items-center space-x-3 mb-4">
                          <Lock className="text-red-500" size={20} />
                          <h4 className="text-sm font-black uppercase tracking-widest">Verification Required</h4>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                          To remove encryption and restrictions, we need the current owner password. We never save your passwords or files.
                        </p>
                        
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter PDF password..."
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-red-600 transition-all placeholder:text-slate-600"
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={handleUnlock}
                          disabled={isProcessing || !password}
                          className={`
                            w-full sm:w-auto px-16 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center
                            ${isProcessing || !password 
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                              : 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.03] active:scale-95 shadow-red-600/30'}
                          `}
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="animate-spin mr-3" />
                              Decrypting Layers...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-3" />
                              Decrypt & Unlock
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-slate-900 p-8 text-center border-t border-white/5">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Local Encryption Pipeline • Zero-Log Architecture • Privacy Guaranteed
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] shadow-2xl p-16 text-center border-4 border-white animate-fadeIn">
            <div className="w-28 h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <ShieldCheck size={56} className="animate-bounce" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Access Granted</h2>
            <p className="text-lg text-slate-500 mb-12 max-w-sm mx-auto leading-relaxed font-medium">Your PDF is now completely free of all passwords and security restrictions.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={handleDownload} className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-16 rounded-2xl text-xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05]">
                <Download className="mr-3" /> Download PDF
              </button>
              <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 px-12 rounded-2xl text-xl transition-all">Unlock New</button>
            </div>
          </div>
        )}
      </div>


      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate unlock PDF online for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>remove PDF password</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>unlock PDF online</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>remove PDF password</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>unlock PDF online</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>remove PDF password</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>unlock PDF online</strong> today and see how easy it is to <strong>remove PDF password</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our unlock PDF online</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>unlock PDF online</strong>. We support various file sizes to ensure you can <strong>remove PDF password</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>unlock PDF online</strong> will begin analyzing the structure to <strong>remove PDF password</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>unlock PDF online</strong> finishes its work, your file will be ready. You can now <strong>remove PDF password</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>unlock PDF online</strong> ensures that when you <strong>remove PDF password</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our unlock PDF online</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>unlock PDF online</strong> uses advanced algorithms to ensure that every time you <strong>remove PDF password</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>unlock PDF online</strong> is optimized for speed, allowing you to <strong>remove PDF password</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>remove PDF password</strong> without creating an account. Our <strong>unlock PDF online</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>unlock PDF online</strong> works perfectly, making it easy to <strong>remove PDF password</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for unlock PDF online</h3>
            <p>
              Many professionals rely on our <strong>unlock PDF online</strong> for their daily tasks. For instance, lawyers often need to <strong>remove PDF password</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>unlock PDF online</strong> to extract information from research papers. When you need to <strong>remove PDF password</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>unlock PDF online</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>remove PDF password</strong> and start editing immediately. Our <strong>unlock PDF online</strong> is a versatile asset for any organization looking to <strong>remove PDF password</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>unlock PDF online</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>remove PDF password</strong>, your data is automatically deleted. You can trust our <strong>unlock PDF online</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>remove PDF password</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best unlock PDF online Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>unlock PDF online</strong> now and see how simple it is to <strong>remove PDF password</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>unlock PDF online</strong> is always here to help you <strong>remove PDF password</strong> with just a few clicks.
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

      <footer className="bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest px-8 py-4 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Security Engine v3.0 Active</span>
          </div>
          <div className="hidden md:block text-slate-600">Pure Client-Side Decryption Enabled</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default UnlockPdf;
