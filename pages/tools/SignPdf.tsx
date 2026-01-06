
import React, { useState, useRef, useEffect } from 'react';
import { 
  Signature, FilePlus, Download, CheckCircle, 
  Trash2, ArrowLeft, RefreshCw, PenTool, 
  Type, Move, Maximize, MousePointer2, 
  PlusCircle, Eraser, FileText, ChevronLeft, 
  ChevronRight, Save, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

interface SignatureObject {
  id: string;
  dataUrl: string;
  x: number;
  y: number;
  scale: number;
  pageIndex: number;
}

const SignPdf: React.FC = () => {
  const [file, setFile] = useState<{ name: string, data: ArrayBuffer, pages: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [signatures, setSignatures] = useState<SignatureObject[]>([]);
  const [activeSignId, setActiveSignId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalBlob, setFinalBlob] = useState<Blob | null>(null);
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signMode, setSignMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // Initialize Drawing Canvas
  useEffect(() => {
    if (isModalOpen && signMode === 'draw' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
      }
    }
  }, [isModalOpen, signMode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const buffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    setFile({
      name: selectedFile.name,
      data: buffer,
      pages: pdfDoc.getPageCount()
    });
    setCurrentPage(0);
    setSignatures([]);
    setIsDone(false);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveNewSignature = () => {
    let dataUrl = '';
    if (signMode === 'draw' && canvasRef.current) {
      dataUrl = canvasRef.current.toDataURL('image/png');
    } else if (signMode === 'type' && typedName) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 150;
      const tctx = tempCanvas.getContext('2d');
      if (tctx) {
        tctx.font = 'italic 60px cursive';
        tctx.fillStyle = '#000000';
        tctx.textAlign = 'center';
        tctx.textBaseline = 'middle';
        tctx.fillText(typedName, 200, 75);
        dataUrl = tempCanvas.toDataURL('image/png');
      }
    }

    if (dataUrl) {
      const newSign: SignatureObject = {
        id: Math.random().toString(36).substr(2, 9),
        dataUrl,
        x: 50,
        y: 80,
        scale: 1,
        pageIndex: currentPage
      };
      setSignatures([...signatures, newSign]);
      setActiveSignId(newSign.id);
      setIsModalOpen(false);
      setTypedName('');
    }
  };

  const updateSign = (id: string, updates: Partial<SignatureObject>) => {
    setSignatures(signatures.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleFinish = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.load(file.data);
      
      for (const sign of signatures) {
        const page = pdfDoc.getPage(sign.pageIndex);
        const { width, height } = page.getSize();
        
        const imgBytes = await fetch(sign.dataUrl).then(res => res.arrayBuffer());
        const embeddedImg = await pdfDoc.embedPng(imgBytes);
        
        const signWidth = 150 * sign.scale;
        const signHeight = 60 * sign.scale;
        
        // Convert UI % to PDF points (origin bottom-left)
        const drawX = (sign.x / 100) * width - (signWidth / 2);
        const drawY = height - ((sign.y / 100) * height) - (signHeight / 2);

        page.drawImage(embeddedImg, {
          x: drawX,
          y: drawY,
          width: signWidth,
          height: signHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setFinalBlob(blob);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Signing failed. The document might be protected.");
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSignatures([]);
    setIsDone(false);
    setFinalBlob(null);
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
              <Signature className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase">Sign PDF</h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest tracking-[0.2em]">Signature Studio</span>
            </div>
          </div>
        </div>
        
        {file && !isDone && (
          <button
            onClick={handleFinish}
            disabled={isProcessing}
            className={`
              flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
              ${isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <ShieldCheck className="mr-2 w-4 h-4" />}
            {isProcessing ? 'Flattening...' : 'Finish & Save'}
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {!file ? (
          <div className="flex-grow flex items-center justify-center p-12">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="max-w-2xl w-full aspect-video border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-white transition-all group bg-white shadow-xl"
            >
              <div className="w-20 h-20 bg-slate-50 group-hover:bg-red-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-sm">
                <FilePlus className="w-10 h-10 text-slate-300 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Load Document to Sign</h2>
              <p className="text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-widest">Electronic Signature Engine v2.0</p>
            </div>
          </div>
        ) : isDone ? (
          <div className="flex-grow flex items-center justify-center bg-slate-100 p-8">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 text-center border-4 border-white max-w-2xl w-full animate-fadeIn">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Signed Successfully</h2>
                <p className="text-lg text-slate-500 mb-10 font-medium leading-relaxed">Your digital signature has been flattened and secured into the PDF structure.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href={finalBlob ? URL.createObjectURL(finalBlob) : '#'} 
                    download={`signed-${file.name}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-16 rounded-2xl text-xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05]"
                  >
                    <Download className="mr-3" /> Download Signed PDF
                  </a>
                  <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 px-12 rounded-2xl text-xl transition-all">
                    Start New
                  </button>
                </div>
             </div>
          </div>
        ) : (
          <>
            {/* Page Navigator Sidebar */}
            <aside className="w-full lg:w-72 bg-slate-900 border-r border-white/5 flex flex-col p-6 overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page Manager</h3>
                <span className="text-[10px] font-black text-red-500">{currentPage + 1} / {file.pages}</span>
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: file.pages }).map((_, i) => (
                  <div 
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`
                      relative aspect-[1/1.414] rounded-xl border-2 transition-all cursor-pointer group p-3 flex flex-col justify-between overflow-hidden
                      ${currentPage === i ? 'border-red-600 bg-red-600/10' : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'}
                    `}
                  >
                    <span className={`text-[10px] font-black ${currentPage === i ? 'text-red-500' : 'text-slate-600'}`}>{i + 1}</span>
                    <div className="flex items-center justify-center opacity-10 group-hover:opacity-30">
                      <FileText size={40} className="text-white" />
                    </div>
                    {signatures.some(s => s.pageIndex === i) && (
                      <div className="absolute top-2 right-2">
                        <Signature size={12} className="text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Main Signing Stage */}
            <main className="flex-grow bg-slate-200 p-8 flex flex-col items-center justify-center overflow-y-auto relative">
              {/* Floating Signature Inserter */}
              <div className="absolute top-8 flex items-center bg-white shadow-2xl rounded-2xl p-2 border border-slate-200 z-40 space-x-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-black text-xs transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-200"
                >
                  <PlusCircle size={16} /> <span>Add Signature</span>
                </button>
              </div>

              {/* PDF Sheet Preview */}
              <div 
                className="w-full max-w-[650px] aspect-[1/1.414] bg-white shadow-2xl relative overflow-hidden ring-1 ring-slate-900/10 cursor-crosshair"
                onClick={() => setActiveSignId(null)}
              >
                {/* Visual Placeholder for PDF Content */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none p-12 select-none space-y-8">
                  <div className="h-10 w-1/2 bg-slate-900 rounded-lg"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-slate-900 rounded"></div>
                    <div className="h-4 w-full bg-slate-900 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-900 rounded"></div>
                  </div>
                  <div className="h-64 w-full bg-slate-900 rounded-2xl"></div>
                  <div className="flex justify-between items-end pt-20">
                    <div className="w-48 h-px bg-slate-900"></div>
                    <div className="w-48 h-px bg-slate-900"></div>
                  </div>
                </div>

                {/* Placed Signatures */}
                {signatures.filter(s => s.pageIndex === currentPage).map((sign) => (
                  <div
                    key={sign.id}
                    onClick={(e) => { e.stopPropagation(); setActiveSignId(sign.id); }}
                    className={`
                      absolute p-1 group transition-all
                      ${activeSignId === sign.id ? 'ring-2 ring-red-600 ring-offset-2 z-50' : 'hover:ring-1 hover:ring-red-300'}
                    `}
                    style={{ 
                      left: `${sign.x}%`, 
                      top: `${sign.y}%`, 
                      transform: 'translate(-50%, -50%)',
                      cursor: activeSignId === sign.id ? 'move' : 'pointer'
                    }}
                    draggable
                    onDragEnd={(e) => {
                       const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                       if (rect) {
                          updateSign(sign.id, {
                             x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
                             y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
                          });
                       }
                    }}
                  >
                    <img 
                      src={sign.dataUrl} 
                      style={{ width: `${150 * sign.scale}px` }} 
                      className="pointer-events-none select-none"
                    />
                    
                    {activeSignId === sign.id && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sign.id)); }}
                        className="absolute -top-4 -right-4 w-6 h-6 bg-white border border-slate-200 text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center space-x-6 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm">
                <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} className="p-2 hover:bg-white rounded-full transition-colors text-slate-600">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Page {currentPage + 1}</span>
                <button onClick={() => setCurrentPage(Math.min(file.pages - 1, currentPage + 1))} className="p-2 hover:bg-white rounded-full transition-colors text-slate-600">
                  <ChevronRight size={20} />
                </button>
              </div>
            </main>

            {/* Properties Sidebar */}
            <aside className="w-full lg:w-80 bg-white border-l border-slate-200 p-8 space-y-10 overflow-y-auto scrollbar-hide">
              <section>
                <div className="flex items-center space-x-2 mb-8">
                  <PenTool className="w-4 h-4 text-red-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Sign Settings</h3>
                </div>

                {!activeSignId ? (
                   <div className="bg-slate-50 border border-dashed border-slate-200 p-10 rounded-[2.5rem] text-center">
                      <MousePointer2 className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-relaxed">Select a placed signature to adjust</p>
                   </div>
                ) : (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Sign Scale</span>
                        <span className="text-red-600">{Math.round(signatures.find(s => s.id === activeSignId)!.scale * 100)}%</span>
                      </div>
                      <input 
                        type="range" min="0.3" max="2.5" step="0.1" 
                        value={signatures.find(s => s.id === activeSignId)!.scale}
                        onChange={(e) => updateSign(activeSignId, { scale: parseFloat(e.target.value) })}
                        className="w-full accent-red-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                       <button 
                          onClick={() => setSignatures(signatures.filter(s => s.id !== activeSignId))}
                          className="w-full py-4 bg-slate-50 text-red-600 font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center space-x-2"
                       >
                          <Trash2 size={14} /> <span>Remove Active</span>
                       </button>
                    </div>
                  </div>
                )}
              </section>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <ShieldCheck size={16} className="text-red-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest tracking-widest">Digital Integrity</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Your signatures are embedded at high resolution. Once flattened, they become an integral part of the document structure.
                </p>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Signature Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <Eraser size={20} />
              </button>

              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Create New Signature</h3>
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                  <button 
                    onClick={() => setSignMode('draw')}
                    className={`flex-grow flex items-center justify-center py-3 space-x-2 rounded-xl transition-all ${signMode === 'draw' ? 'bg-white text-red-600 shadow-lg' : 'text-slate-400'}`}
                  >
                    <PenTool size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Draw</span>
                  </button>
                  <button 
                    onClick={() => setSignMode('type')}
                    className={`flex-grow flex items-center justify-center py-3 space-x-2 rounded-xl transition-all ${signMode === 'type' ? 'bg-white text-red-600 shadow-lg' : 'text-slate-400'}`}
                  >
                    <Type size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
                  </button>
                </div>

                {signMode === 'draw' ? (
                  <div className="space-y-4">
                    <canvas 
                      ref={canvasRef}
                      width={400}
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full bg-slate-50 rounded-3xl border-2 border-slate-100 cursor-crosshair shadow-inner"
                    />
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sign inside the box</span>
                       <button onClick={clearCanvas} className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center">
                          <Eraser size={12} className="mr-1" /> Clear Canvas
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <input 
                      type="text" 
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Enter your full name..."
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xl font-medium outline-none focus:border-red-600 transition-all"
                    />
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex items-center justify-center min-h-[150px]">
                       <p className="text-4xl font-medium italic text-slate-900 font-serif" style={{ fontFamily: 'cursive' }}>
                         {typedName || 'Your Signature'}
                       </p>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-[10px] tracking-[0.2em]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveNewSignature}
                    disabled={signMode === 'type' && !typedName}
                    className="flex-grow py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-200 hover:bg-red-700 active:scale-95 transition-all"
                  >
                    Create Sign
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Branded Footer */}

      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate sign PDF online for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>electronic signature PDF</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>sign PDF online</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>electronic signature PDF</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>sign PDF online</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>electronic signature PDF</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>sign PDF online</strong> today and see how easy it is to <strong>electronic signature PDF</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our sign PDF online</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>sign PDF online</strong>. We support various file sizes to ensure you can <strong>electronic signature PDF</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>sign PDF online</strong> will begin analyzing the structure to <strong>electronic signature PDF</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>sign PDF online</strong> finishes its work, your file will be ready. You can now <strong>electronic signature PDF</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>sign PDF online</strong> ensures that when you <strong>electronic signature PDF</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our sign PDF online</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>sign PDF online</strong> uses advanced algorithms to ensure that every time you <strong>electronic signature PDF</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>sign PDF online</strong> is optimized for speed, allowing you to <strong>electronic signature PDF</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>electronic signature PDF</strong> without creating an account. Our <strong>sign PDF online</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>sign PDF online</strong> works perfectly, making it easy to <strong>electronic signature PDF</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for sign PDF online</h3>
            <p>
              Many professionals rely on our <strong>sign PDF online</strong> for their daily tasks. For instance, lawyers often need to <strong>electronic signature PDF</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>sign PDF online</strong> to extract information from research papers. When you need to <strong>electronic signature PDF</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>sign PDF online</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>electronic signature PDF</strong> and start editing immediately. Our <strong>sign PDF online</strong> is a versatile asset for any organization looking to <strong>electronic signature PDF</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>sign PDF online</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>electronic signature PDF</strong>, your data is automatically deleted. You can trust our <strong>sign PDF online</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>electronic signature PDF</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best sign PDF online Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>sign PDF online</strong> now and see how simple it is to <strong>electronic signature PDF</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>sign PDF online</strong> is always here to help you <strong>electronic signature PDF</strong> with just a few clicks.
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
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>SignCore v2.1 Active</span>
          </div>
          <div className="hidden md:block">ISO-Standard PDF Flattening Optimized</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default SignPdf;
