
import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, FilePlus, Download, RefreshCw, CheckCircle, 
  FileText, AlertCircle, ArrowLeft, Trash2, Info, 
  LayoutGrid, ListFilter, Hash, MousePointerClick, 
  ChevronRight, Copy, Layers, FileOutput
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

interface LoadedFile {
  name: string;
  size: string;
  pageCount: number;
  data: ArrayBuffer;
}

type SplitMode = 'range' | 'fixed' | 'odd_even' | 'manual';

const SplitPdf: React.FC = () => {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [mode, setMode] = useState<SplitMode>('range');
  const [range, setRange] = useState('');
  const [fixedN, setFixedN] = useState(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [outputFiles, setOutputFiles] = useState<{ blob: Blob, name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pageCount = pdf.getPageCount();

      setFile({
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        pageCount,
        data: buffer
      });
      setSelectedPages([]);
      setRange('');
    } catch (error) {
      alert('Error loading PDF. The file might be corrupted or protected.');
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages(prev => 
      prev.includes(pageIndex) 
        ? prev.filter(p => p !== pageIndex) 
        : [...prev, pageIndex].sort((a, b) => a - b)
    );
  };

  const selectOdd = () => {
    if (!file) return;
    const odds = [];
    for (let i = 0; i < file.pageCount; i++) if ((i + 1) % 2 !== 0) odds.push(i);
    setSelectedPages(odds);
  };

  const selectEven = () => {
    if (!file) return;
    const evens = [];
    for (let i = 0; i < file.pageCount; i++) if ((i + 1) % 2 === 0) evens.push(i);
    setSelectedPages(evens);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    const results: { blob: Blob, name: string }[] = [];

    try {
      const srcPdf = await PDFDocument.load(file.data);

      if (mode === 'fixed') {
        // Split every N pages
        for (let i = 0; i < file.pageCount; i += fixedN) {
          const splitPdf = await PDFDocument.create();
          const end = Math.min(i + fixedN, file.pageCount);
          const indices = Array.from({ length: end - i }, (_, k) => i + k);
          const copiedPages = await splitPdf.copyPages(srcPdf, indices);
          copiedPages.forEach(p => splitPdf.addPage(p));
          const bytes = await splitPdf.save();
          results.push({
            blob: new Blob([bytes], { type: 'application/pdf' }),
            name: `${file.name.replace('.pdf', '')}_part_${Math.floor(i / fixedN) + 1}.pdf`
          });
        }
      } else {
        // Range, Odd/Even, Manual all use indices
        let finalIndices: number[] = [];
        
        if (mode === 'manual' || mode === 'odd_even') {
          finalIndices = [...selectedPages];
        } else if (mode === 'range') {
          const parts = range.split(',').map(p => p.trim());
          for (const part of parts) {
            if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end)) {
                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                  if (i > 0 && i <= file.pageCount) finalIndices.push(i - 1);
                }
              }
            } else {
              const num = Number(part);
              if (!isNaN(num) && num > 0 && num <= file.pageCount) finalIndices.push(num - 1);
            }
          }
        }

        if (finalIndices.length === 0) throw new Error('No pages selected for extraction.');

        const splitPdf = await PDFDocument.create();
        const uniqueSorted = Array.from(new Set(finalIndices)).sort((a, b) => a - b);
        const copiedPages = await splitPdf.copyPages(srcPdf, uniqueSorted);
        copiedPages.forEach(p => splitPdf.addPage(p));
        const bytes = await splitPdf.save();
        results.push({
          blob: new Blob([bytes], { type: 'application/pdf' }),
          name: `split-${file.name}`
        });
      }

      setOutputFiles(results);
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1200);
    } catch (error: any) {
      alert(error.message || 'Processing failed.');
      setIsProcessing(false);
    }
  };

  const handleDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setRange('');
    setMode('range');
    setSelectedPages([]);
    setIsDone(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Studio Branded Header */}
      <div className="bg-white border-b-2 border-red-600 px-6 py-4 flex items-center justify-between sticky top-16 z-40 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/tools" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Split PDF <span className="text-red-600">Studio</span></h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v3.5 Advanced Extraction</span>
            </div>
          </div>
        </div>
        
        {file && !isDone && (
          <button
            onClick={handleSplit}
            disabled={isProcessing || (mode === 'range' && !range.trim()) || (mode === 'manual' && selectedPages.length === 0)}
            className={`
              flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
              ${isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <FileOutput className="mr-2 w-4 h-4" />}
            Extract Documents
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {!isDone ? (
          <>
            {/* Configuration Sidebar */}
            <aside className={`
              w-full lg:w-96 bg-white border-r border-slate-200 p-6 space-y-8 overflow-y-auto scrollbar-hide
              ${!file ? 'opacity-50 pointer-events-none' : ''}
            `}>
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <ListFilter className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Selection Mode</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'range', label: 'Custom Range', icon: <Hash size={14} /> },
                    { id: 'fixed', label: 'Fixed Every N', icon: <Copy size={14} /> },
                    { id: 'odd_even', label: 'Odd/Even', icon: <Layers size={14} /> },
                    { id: 'manual', label: 'Visual Select', icon: <MousePointerClick size={14} /> }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as SplitMode)}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2
                        ${mode === m.id ? 'border-red-600 bg-red-50 text-red-600 shadow-md' : 'border-slate-100 text-slate-400 hover:border-slate-200'}
                      `}
                    >
                      {m.icon}
                      <span className="text-[10px] font-black uppercase tracking-tighter">{m.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Dynamic Settings */}
              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                {mode === 'range' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Enter Page Range</label>
                    <input 
                      type="text"
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                      placeholder="e.g. 1-3, 5, 10-12"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-black text-slate-900 outline-none focus:border-red-600 transition-all"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Use commas for multiple ranges and dashes for page spans.</p>
                  </div>
                )}

                {mode === 'fixed' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Split Every N Pages</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="number"
                        min="1"
                        max={file?.pageCount || 100}
                        value={fixedN}
                        onChange={(e) => setFixedN(parseInt(e.target.value))}
                        className="w-24 px-5 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-black text-slate-900 outline-none focus:border-red-600 transition-all"
                      />
                      <span className="text-sm font-bold text-slate-500">Pages per file</span>
                    </div>
                  </div>
                )}

                {mode === 'odd_even' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Quick Select</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={selectOdd} className="py-4 bg-white border-2 border-slate-200 rounded-xl font-black text-slate-700 hover:border-red-600 hover:text-red-600 transition-all uppercase text-xs">Only Odd</button>
                      <button onClick={selectEven} className="py-4 bg-white border-2 border-slate-200 rounded-xl font-black text-slate-700 hover:border-red-600 hover:text-red-600 transition-all uppercase text-xs">Only Even</button>
                    </div>
                  </div>
                )}

                {mode === 'manual' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Selection Summary</label>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-red-600">{selectedPages.length}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pages Selected</span>
                    </div>
                    <button 
                      onClick={() => setSelectedPages([])}
                      className="text-[10px] font-black text-red-500 uppercase hover:underline"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </section>

              <section className="bg-slate-900 p-6 rounded-3xl text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Info size={14} className="text-red-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Pro Tip</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {mode === 'fixed' 
                    ? "This will generate multiple PDF files, splitting your document into equal chunks."
                    : "Extracting pages creates a new document. Your original file remains untouched and safe."}
                </p>
              </section>
            </aside>

            {/* Main Workspace: File Loader & Page Preview */}
            <main className="flex-grow bg-slate-100 p-6 lg:p-12 overflow-y-auto scrollbar-hide">
              {!file ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <input 
                    type="file" ref={fileInputRef} onChange={handleFileChange} 
                    className="hidden" accept=".pdf" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="max-w-xl w-full aspect-video border-4 border-dashed border-slate-300 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-white transition-all group"
                  >
                    <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <FilePlus className="w-10 h-10 text-slate-400 group-hover:text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select PDF File</h2>
                    <p className="text-slate-400 mt-2 font-medium">Professional Page Extraction Engine</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-5xl mx-auto space-y-10">
                  <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-5">
                      <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-100">
                        <FileText className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">{file.name}</h2>
                        <div className="flex items-center space-x-3 mt-0.5">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase">{file.pageCount} Pages</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={reset} className="p-3 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={24} /></button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                        <LayoutGrid size={14} className="mr-2" /> Page Thumbnails & Selection
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <span className="text-[10px] font-black text-slate-900 uppercase">Interactive Preview</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {Array.from({ length: file.pageCount }).map((_, i) => {
                        const isSelected = mode === 'manual' || mode === 'odd_even' 
                          ? selectedPages.includes(i)
                          : mode === 'range' 
                            ? (range.split(',').some(r => {
                                const [s, e] = r.split('-').map(Number);
                                if (e) return (i+1) >= s && (i+1) <= e;
                                return (i+1) === s;
                              }))
                            : false;

                        return (
                          <div 
                            key={i}
                            onClick={() => mode === 'manual' && togglePageSelection(i)}
                            className={`
                              relative aspect-[1/1.414] bg-white rounded-xl shadow-sm border-2 transition-all p-4 flex flex-col items-center justify-between group
                              ${isSelected ? 'border-red-600 scale-105 shadow-xl shadow-red-900/10' : 'border-white hover:border-slate-300'}
                              ${mode === 'manual' ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                            `}
                          >
                            <div className="w-full flex justify-end">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-red-600 border-red-600' : 'border-slate-200'}`}>
                                {isSelected && <CheckCircle className="text-white" size={12} />}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-center opacity-20 group-hover:opacity-40 transition-opacity">
                              <FileText size={40} className="text-slate-400" />
                            </div>

                            <span className={`text-sm font-black transition-colors ${isSelected ? 'text-red-600' : 'text-slate-400'}`}>
                              {i + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          /* High-Resolution Success Screen */
          <div className="flex-grow flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-red-50/30">
            <div className="max-w-2xl w-full bg-white rounded-[4rem] shadow-2xl p-16 text-center border-4 border-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              
              <div className="w-32 h-32 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                <CheckCircle size={64} className="animate-bounce" />
              </div>
              
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Process Completed!</h2>
              <p className="text-lg text-slate-500 mb-12 max-w-sm mx-auto leading-relaxed font-medium">
                {outputFiles.length > 1 
                  ? `Successfully split your PDF into ${outputFiles.length} separate documents.`
                  : "We've successfully extracted your requested pages into a new professional document."}
              </p>
              
              <div className="space-y-4">
                {outputFiles.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(f.blob, f.name)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 px-10 rounded-2xl text-xl flex items-center justify-between shadow-2xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    <div className="flex items-center">
                      <Download className="mr-4 group-hover:animate-bounce" />
                      <span className="truncate max-w-[200px] sm:max-w-xs text-left">{f.name}</span>
                    </div>
                    <ChevronRight size={24} />
                  </button>
                ))}
              </div>
              
              <button
                onClick={reset}
                className="mt-8 text-slate-400 hover:text-red-600 font-black uppercase text-xs tracking-widest transition-colors"
              >
                Start New Project
              </button>

              <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-center space-x-8 opacity-20 grayscale">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">100% Client-Side</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">High Definition</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secured Output</span>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate split PDF online for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>PDF splitter</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>split PDF online</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>PDF splitter</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>split PDF online</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>PDF splitter</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>split PDF online</strong> today and see how easy it is to <strong>PDF splitter</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our split PDF online</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>split PDF online</strong>. We support various file sizes to ensure you can <strong>PDF splitter</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>split PDF online</strong> will begin analyzing the structure to <strong>PDF splitter</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>split PDF online</strong> finishes its work, your file will be ready. You can now <strong>PDF splitter</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>split PDF online</strong> ensures that when you <strong>PDF splitter</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our split PDF online</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>split PDF online</strong> uses advanced algorithms to ensure that every time you <strong>PDF splitter</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>split PDF online</strong> is optimized for speed, allowing you to <strong>PDF splitter</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>PDF splitter</strong> without creating an account. Our <strong>split PDF online</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>split PDF online</strong> works perfectly, making it easy to <strong>PDF splitter</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for split PDF online</h3>
            <p>
              Many professionals rely on our <strong>split PDF online</strong> for their daily tasks. For instance, lawyers often need to <strong>PDF splitter</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>split PDF online</strong> to extract information from research papers. When you need to <strong>PDF splitter</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>split PDF online</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>PDF splitter</strong> and start editing immediately. Our <strong>split PDF online</strong> is a versatile asset for any organization looking to <strong>PDF splitter</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>split PDF online</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>PDF splitter</strong>, your data is automatically deleted. You can trust our <strong>split PDF online</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>PDF splitter</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best split PDF online Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>split PDF online</strong> now and see how simple it is to <strong>PDF splitter</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>split PDF online</strong> is always here to help you <strong>PDF splitter</strong> with just a few clicks.
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
            <span>SplitCore Engine v4.0 Active</span>
          </div>
          <div className="hidden md:block">Real-time RAM Allocation Optimized</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default SplitPdf;
