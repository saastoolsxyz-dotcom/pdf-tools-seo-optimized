
import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, FilePlus, Download, RefreshCw, Type, Image as ImageIcon, 
  MousePointer2, Trash2, Undo, Save, CheckCircle, Layers, 
  PlusSquare, FileText, ChevronLeft, ChevronRight, 
  Bold, Italic, Type as FontIcon, Move, GripVertical, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface EditorElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  content: string; // text string or image data url
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  width?: number;
  height?: number;
}

interface PageData {
  id: string;
  originalIndex: number | null; // null if blank page
  elements: EditorElement[];
}

const EditPdf: React.FC = () => {
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Load PDF
  const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();
      
      const initialPages: PageData[] = Array.from({ length: count }).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        originalIndex: i,
        elements: []
      }));

      setPdfBuffer(buffer);
      setFileName(file.name);
      setPages(initialPages);
      setCurrentPageIdx(0);
    } catch (error) {
      alert("Failed to load PDF. It might be protected or corrupted.");
    }
  };

  // Page Management
  const addBlankPage = () => {
    const newPage: PageData = {
      id: Math.random().toString(36).substr(2, 9),
      originalIndex: null,
      elements: []
    };
    const newPages = [...pages];
    newPages.splice(currentPageIdx + 1, 0, newPage);
    setPages(newPages);
    setCurrentPageIdx(currentPageIdx + 1);
  };

  const deleteCurrentPage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== currentPageIdx);
    setPages(newPages);
    setCurrentPageIdx(Math.max(0, currentPageIdx - 1));
  };

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= pages.length) return;
    const newPages = [...pages];
    const [moved] = newPages.splice(from, 1);
    newPages.splice(to, 0, moved);
    setPages(newPages);
    setCurrentPageIdx(to);
  };

  // Element Management
  const addTextElement = () => {
    const newEl: EditorElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      x: 50,
      y: 50,
      content: 'Double click to edit',
      fontSize: 18,
      color: '#1e293b',
      isBold: false,
      isItalic: false
    };
    const updatedPages = [...pages];
    updatedPages[currentPageIdx].elements.push(newEl);
    setPages(updatedPages);
    setSelectedElementId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newEl: EditorElement = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        x: 50,
        y: 50,
        content: event.target?.result as string,
        fontSize: 0,
        color: '',
        isBold: false,
        isItalic: false,
        width: 150,
        height: 150
      };
      const updatedPages = [...pages];
      updatedPages[currentPageIdx].elements.push(newEl);
      setPages(updatedPages);
      setSelectedElementId(newEl.id);
    };
    reader.readAsDataURL(file);
  };

  const updateSelectedElement = (updates: Partial<EditorElement>) => {
    if (!selectedElementId) return;
    const updatedPages = pages.map((page, pIdx) => {
      if (pIdx !== currentPageIdx) return page;
      return {
        ...page,
        elements: page.elements.map(el => el.id === selectedElementId ? { ...el, ...updates } : el)
      };
    });
    setPages(updatedPages);
  };

  const removeElement = (id: string) => {
    const updatedPages = pages.map((page, pIdx) => {
      if (pIdx !== currentPageIdx) return page;
      return {
        ...page,
        elements: page.elements.filter(el => el.id !== id)
      };
    });
    setPages(updatedPages);
    setSelectedElementId(null);
  };

  // Final Export
  const handleExport = async () => {
    if (!pdfBuffer) return;
    setIsProcessing(true);

    try {
      const srcDoc = await PDFDocument.load(pdfBuffer);
      const outDoc = await PDFDocument.create();
      const helvetica = await outDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await outDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaOblique = await outDoc.embedFont(StandardFonts.HelveticaOblique);

      for (const pageData of pages) {
        let page;
        if (pageData.originalIndex !== null) {
          const [copiedPage] = await outDoc.copyPages(srcDoc, [pageData.originalIndex]);
          page = outDoc.addPage(copiedPage);
        } else {
          page = outDoc.addPage([595.28, 841.89]); // A4
        }

        const { width, height } = page.getSize();

        for (const el of pageData.elements) {
          const drawX = (el.x / 100) * width;
          const drawY = height - ((el.y / 100) * height);

          if (el.type === 'text') {
            const hex = el.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;

            let font = helvetica;
            if (el.isBold) font = helveticaBold;
            else if (el.isItalic) font = helveticaOblique;

            page.drawText(el.content, {
              x: drawX,
              y: drawY,
              size: el.fontSize,
              font: font,
              color: rgb(r, g, b),
            });
          } else if (el.type === 'image') {
            const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
            const embeddedImg = el.content.includes('png') ? await outDoc.embedPng(imgBytes) : await outDoc.embedJpg(imgBytes);
            page.drawImage(embeddedImg, {
              x: drawX - (el.width! / 2),
              y: drawY - (el.height! / 2),
              width: el.width,
              height: el.height,
            });
          }
        }
      }

      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setExportUrl(URL.createObjectURL(blob));
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfBuffer(null);
    setPages([]);
    setIsDone(false);
    setExportUrl(null);
  };

  const currentElement = selectedElementId 
    ? pages[currentPageIdx]?.elements.find(e => e.id === selectedElementId) 
    : null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Dynamic Studio Header */}
      <div className="bg-white border-b-2 border-red-600 px-6 py-4 flex items-center justify-between sticky top-16 z-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/tools" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {pdfBuffer ? fileName : 'PDF Edit Studio'}
              </h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">Live Document Architect</span>
            </div>
          </div>
        </div>
        
        {pdfBuffer && !isDone && (
          <div className="flex items-center space-x-3">
             <button
              onClick={handleExport}
              disabled={isProcessing}
              className="flex items-center px-8 py-3.5 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all"
            >
              {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Save className="mr-2 w-4 h-4" />}
              Export Result
            </button>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {!pdfBuffer ? (
          <div className="flex-grow flex flex-col items-center justify-center p-12">
            <input type="file" ref={fileInputRef} onChange={handleFileLoad} className="hidden" accept=".pdf" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="max-w-2xl w-full aspect-[2/1] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-white transition-all group bg-slate-50 shadow-inner"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <FilePlus className="w-10 h-10 text-slate-300 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">Open Document</h2>
              <p className="text-slate-400 mt-2 font-medium">Professional Visual PDF Editor</p>
            </div>
          </div>
        ) : isDone ? (
          <div className="flex-grow flex items-center justify-center bg-slate-100 p-8">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 text-center border-4 border-white max-w-2xl w-full animate-fadeIn">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Edited Successfully</h2>
                <p className="text-lg text-slate-500 mb-10 font-medium">All text and image layers have been flattened into your new document.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href={exportUrl || '#'} 
                    download={`edited-${fileName}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-16 rounded-2xl text-xl flex items-center justify-center shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.05]"
                  >
                    <Download className="mr-3" /> Download PDF
                  </a>
                  <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 px-12 rounded-2xl text-xl transition-all">
                    Edit New
                  </button>
                </div>
             </div>
          </div>
        ) : (
          <>
            {/* Sidebar Left: Page Manager */}
            <aside className="w-full lg:w-64 bg-slate-900 border-r border-white/5 flex flex-col p-4 overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page Manager</h3>
                <button onClick={addBlankPage} className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <PlusSquare size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {pages.map((p, i) => (
                  <div 
                    key={p.id}
                    onClick={() => setCurrentPageIdx(i)}
                    className={`
                      relative aspect-[1/1.414] rounded-xl border-2 transition-all cursor-pointer group p-3 flex flex-col justify-between
                      ${currentPageIdx === i ? 'border-red-600 bg-red-600/10' : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black ${currentPageIdx === i ? 'text-red-500' : 'text-slate-600'}`}>{i + 1}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <button onClick={(e) => { e.stopPropagation(); movePage(i, i-1); }} className="p-1 bg-slate-700 rounded text-white hover:bg-red-600"><GripVertical size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setCurrentPageIdx(i); deleteCurrentPage(); }} className="p-1 bg-slate-700 rounded text-white hover:bg-red-600"><Trash2 size={10} /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center opacity-20 group-hover:opacity-40">
                      {p.originalIndex !== null ? <FileText size={40} /> : <div className="w-10 h-10 border border-dashed border-white rounded"></div>}
                    </div>
                    <div className="text-[8px] text-center font-bold text-slate-700">
                      {p.elements.length} Elements
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Main Stage: Content Editor */}
            <main className="flex-grow bg-slate-200 p-8 flex flex-col overflow-y-auto relative">
              {/* Floating Toolbar */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center bg-white shadow-2xl rounded-2xl p-2 border border-slate-200 z-40 space-x-1">
                <button onClick={addTextElement} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-700 font-bold text-xs transition-all">
                  <Type size={16} className="text-red-600" /> <span>Add Text</span>
                </button>
                <div className="w-px h-6 bg-slate-100"></div>
                <button onClick={() => imageUploadRef.current?.click()} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 rounded-xl text-slate-700 font-bold text-xs transition-all">
                  <ImageIcon size={16} className="text-red-600" /> <span>Add Image</span>
                </button>
                <input type="file" ref={imageUploadRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              {/* Page Sheet */}
              <div className="flex-grow flex items-center justify-center mt-12">
                <div 
                  className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl relative overflow-hidden ring-1 ring-slate-900/10 cursor-crosshair"
                  onClick={() => setSelectedElementId(null)}
                >
                  {/* Mock Background for Original Content */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none p-10 select-none">
                    {pages[currentPageIdx]?.originalIndex !== null ? (
                      <div className="space-y-6">
                        <div className="w-full h-4 bg-slate-200 rounded"></div>
                        <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                        <div className="w-5/6 h-4 bg-slate-200 rounded"></div>
                        <div className="w-full h-32 bg-slate-100 rounded"></div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <span className="text-slate-200 font-black uppercase text-xl">Blank Studio Page</span>
                      </div>
                    )}
                  </div>

                  {/* Layers (Elements) */}
                  {pages[currentPageIdx]?.elements.map((el) => (
                    <div
                      key={el.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                      className={`
                        absolute p-2 group transition-all
                        ${selectedElementId === el.id ? 'ring-2 ring-red-600 ring-offset-2 z-50' : 'hover:ring-1 hover:ring-red-300'}
                      `}
                      style={{ 
                        left: `${el.x}%`, 
                        top: `${el.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        cursor: selectedElementId === el.id ? 'move' : 'pointer'
                      }}
                      draggable
                      onDragEnd={(e) => {
                         const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                         if (rect) {
                            updateSelectedElement({
                               x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
                               y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
                            });
                         }
                      }}
                    >
                      {el.type === 'text' ? (
                        <div 
                          className="outline-none min-w-[10px] whitespace-pre"
                          contentEditable
                          onBlur={(e) => updateSelectedElement({ content: e.currentTarget.textContent || '' })}
                          style={{
                            fontSize: `${el.fontSize}px`,
                            color: el.color,
                            fontWeight: el.isBold ? 'bold' : 'normal',
                            fontStyle: el.isItalic ? 'italic' : 'normal',
                            fontFamily: 'sans-serif'
                          }}
                        >
                          {el.content}
                        </div>
                      ) : (
                        <div className="relative group/img">
                          <img src={el.content} style={{ width: el.width, height: el.height }} className="object-contain" />
                          {selectedElementId === el.id && (
                             <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-red-600 rounded-full cursor-nwse-resize"></div>
                          )}
                        </div>
                      )}

                      {selectedElementId === el.id && (
                         <button 
                            onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                            className="absolute -top-4 -right-4 w-6 h-6 bg-white border border-slate-200 text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all"
                         >
                            <Trash2 size={12} />
                         </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </main>

            {/* Right Sidebar: Properties */}
            <aside className="w-full lg:w-80 bg-white border-l border-slate-200 p-6 space-y-8 overflow-y-auto scrollbar-hide">
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <FontIcon className="w-4 h-4 text-red-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Properties</h3>
                </div>

                {!selectedElementId ? (
                   <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-[2rem] text-center">
                      <MousePointer2 className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-relaxed">Select an element to edit its properties</p>
                   </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {currentElement?.type === 'text' && (
                      <>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Text Styling</label>
                          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                             <button 
                                onClick={() => updateSelectedElement({ isBold: !currentElement.isBold })}
                                className={`flex-grow p-3 rounded-xl transition-all ${currentElement.isBold ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                <Bold size={18} />
                             </button>
                             <button 
                                onClick={() => updateSelectedElement({ isItalic: !currentElement.isItalic })}
                                className={`flex-grow p-3 rounded-xl transition-all ${currentElement.isItalic ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                <Italic size={18} />
                             </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                            <span>Font Size</span>
                            <span className="text-red-600">{currentElement.fontSize}px</span>
                          </div>
                          <input 
                            type="range" min="8" max="120" step="1" 
                            value={currentElement.fontSize}
                            onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })}
                            className="w-full accent-red-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Text Color</label>
                          <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <input 
                              type="color" 
                              value={currentElement.color}
                              onChange={(e) => updateSelectedElement({ color: e.target.value })}
                              className="w-10 h-10 bg-transparent cursor-pointer border-none"
                            />
                            <span className="text-sm font-black text-slate-900 uppercase">{currentElement.color}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {currentElement?.type === 'image' && (
                      <>
                        <div className="space-y-4">
                           <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                              <span>Image Width</span>
                              <span className="text-red-600">{currentElement.width}px</span>
                           </div>
                           <input 
                              type="range" min="20" max="600" step="1" 
                              value={currentElement.width}
                              onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 updateSelectedElement({ width: val, height: val }); // Aspect ratio locked for simplicity
                              }}
                              className="w-full accent-red-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                           />
                        </div>
                      </>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                       <button 
                          onClick={() => removeElement(selectedElementId)}
                          className="w-full py-4 bg-slate-100 text-red-600 font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                       >
                          <Trash2 size={14} /> <span>Delete Element</span>
                       </button>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-slate-900 p-6 rounded-[2rem] text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Move size={14} className="text-red-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Editor Tip</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Elements are positioned relative to page dimensions. Drag items to move them and use the property panel to style your document.
                </p>
              </section>
            </aside>
          </>
        )}
      </div>

      {/* Modern Status Footer */}

      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate edit PDF online for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>free PDF editor</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>edit PDF online</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>free PDF editor</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>edit PDF online</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>free PDF editor</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>edit PDF online</strong> today and see how easy it is to <strong>free PDF editor</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our edit PDF online</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>edit PDF online</strong>. We support various file sizes to ensure you can <strong>free PDF editor</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>edit PDF online</strong> will begin analyzing the structure to <strong>free PDF editor</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>edit PDF online</strong> finishes its work, your file will be ready. You can now <strong>free PDF editor</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>edit PDF online</strong> ensures that when you <strong>free PDF editor</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our edit PDF online</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>edit PDF online</strong> uses advanced algorithms to ensure that every time you <strong>free PDF editor</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>edit PDF online</strong> is optimized for speed, allowing you to <strong>free PDF editor</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>free PDF editor</strong> without creating an account. Our <strong>edit PDF online</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>edit PDF online</strong> works perfectly, making it easy to <strong>free PDF editor</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for edit PDF online</h3>
            <p>
              Many professionals rely on our <strong>edit PDF online</strong> for their daily tasks. For instance, lawyers often need to <strong>free PDF editor</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>edit PDF online</strong> to extract information from research papers. When you need to <strong>free PDF editor</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>edit PDF online</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>free PDF editor</strong> and start editing immediately. Our <strong>edit PDF online</strong> is a versatile asset for any organization looking to <strong>free PDF editor</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>edit PDF online</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>free PDF editor</strong>, your data is automatically deleted. You can trust our <strong>edit PDF online</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>free PDF editor</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best edit PDF online Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>edit PDF online</strong> now and see how simple it is to <strong>free PDF editor</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>edit PDF online</strong> is always here to help you <strong>free PDF editor</strong> with just a few clicks.
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
            <span>Studio Engine v3.5 Active</span>
          </div>
          <div className="hidden md:block">Visual Coordinate System Mapped</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default EditPdf;
