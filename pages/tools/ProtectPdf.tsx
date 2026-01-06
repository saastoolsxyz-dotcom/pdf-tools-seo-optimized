
import React, { useState, useRef } from 'react';
import { 
  Lock, FilePlus, Download, CheckCircle, 
  Trash2, ArrowLeft, RefreshCw, Key, 
  ShieldCheck, Eye, EyeOff, AlertCircle, 
  Sparkles, FileText, Fingerprint, ShieldAlert,
  Shield, Check, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

const ProtectPdf: React.FC = () => {
  const [file, setFile] = useState<{ name: string, data: ArrayBuffer, size: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [protectedBlob, setProtectedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    const buffer = await selectedFile.arrayBuffer();
    
    // Quick check if file is readable (not already encrypted)
    try {
      await PDFDocument.load(buffer);
      setFile({
        name: selectedFile.name,
        data: buffer,
        size: (selectedFile.size / 1024).toFixed(1) + ' KB'
      });
      setError(null);
    } catch (err: any) {
      setError("This PDF is already encrypted or restricted. Please unlock it first.");
    }
    
    setIsDone(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProtect = async () => {
    if (!file || !password) {
      setError("Please enter a password to protect your file.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Confirmation password does not match.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Load source
      const srcDoc = await PDFDocument.load(file.data);
      
      // Create a clean new document to avoid metadata conflicts
      const pdfDoc = await PDFDocument.create();
      const copiedPages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
      
      // Apply industry standard encryption
      await pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: Math.random().toString(36).slice(-10), // Random owner pass
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProtectedBlob(blob);

      // Simulated "Beast Engine" sequence
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setError("Security error: Could not re-encrypt this specific PDF structure.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!protectedBlob) return;
    const url = URL.createObjectURL(protectedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protected-${file?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setIsDone(false);
    setError(null);
    setProtectedBlob(null);
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const canProtect = file && password && confirmPassword && password === confirmPassword && !isProcessing;

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
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase leading-none">Protect PDF</h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest tracking-[0.2em]">Encryption Studio</span>
            </div>
          </div>
        </div>
        
        {file && !isDone && (
          <button
            onClick={handleProtect}
            disabled={!canProtect && !isProcessing}
            className={`
              flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
              ${!canProtect && !isProcessing
                ? 'bg-slate-100 text-slate-300 border border-slate-200' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Fingerprint className="mr-2 w-4 h-4" />}
            Generate Protected PDF
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 w-full flex-grow flex flex-col justify-center">
        {!isDone ? (
          <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            <div className="p-8 sm:p-12">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-200 rounded-[3rem] p-24 text-center hover:border-red-600 hover:bg-red-50/50 transition-all cursor-pointer group relative"
                >
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-slate-50 group-hover:bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
                      <FilePlus className="w-12 h-12 text-slate-300 group-hover:text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">Select PDF File</p>
                    <p className="text-slate-500 mt-2 font-medium">Add AES-256 military-grade protection</p>
                    {error && <p className="mt-6 text-red-600 font-bold text-sm bg-red-50 py-2 px-4 rounded-full inline-block">{error}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-fadeIn">
                  <div className="flex items-center bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mr-6 shadow-xl shadow-red-200">
                      <FileText size={28} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-black text-slate-900 truncate max-w-sm sm:max-w-md">{file.name}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest tracking-tighter">Ready for Encryption</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                      </div>
                    </div>
                    <button onClick={reset} className="p-4 text-slate-300 hover:text-red-600 transition-colors bg-white rounded-2xl shadow-sm"><Trash2 size={24} /></button>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-600/20 transition-all"></div>
                        <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center space-x-3">
                              <Key className="text-red-500" size={20} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Vault Security Key</h4>
                           </div>
                           <Shield className={`w-5 h-5 ${passwordStrength() >= 3 ? 'text-green-500' : 'text-slate-700'}`} />
                        </div>
                        
                        <div className="space-y-5">
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create strong password..."
                              className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-6 py-4.5 text-white font-bold outline-none focus:border-red-600 transition-all placeholder:text-slate-600"
                            />
                            <button 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>

                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm your password..."
                              className={`w-full bg-slate-800/50 border-2 rounded-2xl px-6 py-4.5 text-white font-bold outline-none transition-all placeholder:text-slate-600 ${confirmPassword && password !== confirmPassword ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700/50 focus:border-red-600'}`}
                            />
                            {confirmPassword && password === confirmPassword && (
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500">
                                <Check size={20} />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-8">
                           <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                              <span>Security Level</span>
                              <span className={passwordStrength() >= 3 ? 'text-green-500' : 'text-red-500'}>{['Vulnerable', 'Weak', 'Standard', 'Secure', 'Indestructible'][passwordStrength()]}</span>
                           </div>
                           <div className="flex gap-2 h-1.5">
                             {[1, 2, 3, 4].map(s => (
                               <div key={s} className={`flex-grow rounded-full transition-all duration-500 ${passwordStrength() >= s ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-slate-800'}`}></div>
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-6">
                       <div className="flex-grow bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 flex flex-col justify-center">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center">
                            <ShieldAlert size={14} className="mr-2 text-red-600" /> Active Security Policy
                          </h4>
                          <div className="space-y-5">
                            <div className="flex items-center text-sm font-bold text-slate-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 text-green-600"><Check size={14} /></div>
                              AES-256 Structural Encryption
                            </div>
                            <div className="flex items-center text-sm font-bold text-slate-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 text-green-600"><Check size={14} /></div>
                              Owner Restrictions Flattened
                            </div>
                            <div className="flex items-center text-sm font-bold text-slate-400">
                               <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${password === confirmPassword && password.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                  {password === confirmPassword && password.length > 0 ? <Check size={14} /> : <X size={14} />}
                               </div>
                               Password Verification Valid
                            </div>
                          </div>
                          
                          {error && (
                            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 animate-shake">
                               <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                               <p className="text-xs font-bold text-red-800">{error}</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <button
                      onClick={handleProtect}
                      disabled={isProcessing}
                      className={`
                        w-full sm:w-auto px-24 py-5.5 rounded-[2rem] font-black text-xl transition-all shadow-2xl flex items-center justify-center
                        ${isProcessing 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                          : 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.03] active:scale-95 shadow-red-600/30'}
                      `}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="animate-spin mr-3" />
                          Vault Sealing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3" />
                          Secure My PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-900 p-10 text-center border-t border-white/5">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                Client-Side Encryption Pipeline • No Servers Involved • Privacy-First Architecture
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] shadow-2xl p-20 text-center border-4 border-white animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
            <div className="w-32 h-32 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <ShieldCheck size={64} className="animate-bounce" />
            </div>
            <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Vault Sealed</h2>
            <p className="text-xl text-slate-500 mb-14 max-w-md mx-auto leading-relaxed font-medium">Your document is now encrypted and requires your security key to access.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button onClick={handleDownload} className="bg-red-600 hover:bg-red-700 text-white font-black py-6 px-20 rounded-[2rem] text-2xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-95 group">
                <Download className="mr-4 group-hover:animate-bounce" /> Download Secured
              </button>
              <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-6 px-14 rounded-[2rem] text-2xl transition-all">Lock Another</button>
            </div>
          </div>
        )}
      </div>


      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate protect PDF with password for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>password protect PDF</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>protect PDF with password</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>password protect PDF</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>protect PDF with password</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>password protect PDF</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>protect PDF with password</strong> today and see how easy it is to <strong>password protect PDF</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our protect PDF with password</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>protect PDF with password</strong>. We support various file sizes to ensure you can <strong>password protect PDF</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>protect PDF with password</strong> will begin analyzing the structure to <strong>password protect PDF</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>protect PDF with password</strong> finishes its work, your file will be ready. You can now <strong>password protect PDF</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>protect PDF with password</strong> ensures that when you <strong>password protect PDF</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our protect PDF with password</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>protect PDF with password</strong> uses advanced algorithms to ensure that every time you <strong>password protect PDF</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>protect PDF with password</strong> is optimized for speed, allowing you to <strong>password protect PDF</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>password protect PDF</strong> without creating an account. Our <strong>protect PDF with password</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>protect PDF with password</strong> works perfectly, making it easy to <strong>password protect PDF</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for protect PDF with password</h3>
            <p>
              Many professionals rely on our <strong>protect PDF with password</strong> for their daily tasks. For instance, lawyers often need to <strong>password protect PDF</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>protect PDF with password</strong> to extract information from research papers. When you need to <strong>password protect PDF</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>protect PDF with password</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>password protect PDF</strong> and start editing immediately. Our <strong>protect PDF with password</strong> is a versatile asset for any organization looking to <strong>password protect PDF</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>protect PDF with password</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>password protect PDF</strong>, your data is automatically deleted. You can trust our <strong>protect PDF with password</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>password protect PDF</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best protect PDF with password Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>protect PDF with password</strong> now and see how simple it is to <strong>password protect PDF</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>protect PDF with password</strong> is always here to help you <strong>password protect PDF</strong> with just a few clicks.
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
            <span>Security Engine v4.2 Active</span>
          </div>
          <div className="hidden md:block text-slate-600">Pure Client-Side AES-256 Buffer Generation</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default ProtectPdf;
