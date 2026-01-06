
import React, { useState, useRef } from 'react';
import { 
  ImageIcon, FilePlus, Download, CheckCircle, 
  Trash2, ArrowLeft, RefreshCw, LayoutGrid, 
  ArrowUp, ArrowDown, Settings, Maximize,
  FileImage, Move
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

interface ImageItem {
  id: string;
  name: string;
  dataUrl: string;
  size: string;
}

const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fitMode, setFitMode] = useState<'fit' | 'original'>('fit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const filesArray = Array.from(selectedFiles) as File[];
    for (const file of filesArray) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          dataUrl: event.target?.result as string,
          size: (file.size / 1024).toFixed(1) + ' KB'
        }]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsDone(false);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
  };

  /**
   * Normalizes any image type to a standard PNG ArrayBuffer using Canvas
   * This fixes issues with progressive JPEGs and unsupported formats like WebP in pdf-lib
   */
  const processImageToPngBytes = (dataUrl: string): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then(resolve).catch(reject);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = dataUrl;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imgItem of images) {
        // Step 1: Normalize image to PNG bytes to ensure compatibility
        const pngBytes = await processImageToPngBytes(imgItem.dataUrl);
        
        // Step 2: Embed the normalized PNG
        const embeddedImg = await pdfDoc.embedPng(pngBytes);
        
        const { width, height } = embeddedImg.scale(1);
        const pageWidth = 595.28; // A4 Width in points
        const pageHeight = 841.89; // A4 Height in points

        const page = pdfDoc.addPage(fitMode === 'fit' ? [pageWidth, pageHeight] : [width, height]);
        
        if (fitMode === 'fit') {
          const scale = Math.min(pageWidth / width, pageHeight / height) * 0.95; // 5% margin
          const drawWidth = width * scale;
          const drawHeight = height * scale;
          
          page.drawImage(embeddedImg, {
            x: (pageWidth - drawWidth) / 2,
            y: (pageHeight - drawHeight) / 2,
            width: drawWidth,
            height: drawHeight,
          });
        } else {
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 1500);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert("Conversion failed. Please ensure the images are not corrupted.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `texttopdf-images-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setImages([]);
    setPdfBlob(null);
    setIsDone(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-white border-b-2 border-red-600 px-6 py-4 flex items-center justify-between sticky top-16 z-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/tools" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase">JPG to PDF</h1>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest tracking-[0.2em]">Image Studio</span>
            </div>
          </div>
        </div>
        
        {images.length > 0 && !isDone && (
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className={`
              flex items-center px-8 py-3.5 rounded-2xl font-black text-sm transition-all
              ${isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95'}
            `}
          >
            {isProcessing ? <RefreshCw className="animate-spin mr-2 w-4 h-4" /> : <Maximize className="mr-2 w-4 h-4" />}
            {isProcessing ? 'Processing...' : 'Generate PDF'}
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {!isDone ? (
          <>
            <aside className={`w-full lg:w-80 bg-white border-r border-slate-200 p-6 space-y-8 overflow-y-auto ${images.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Page Configuration</h3>
                </div>
                <div className="space-y-4">
                   <button 
                    onClick={() => setFitMode('fit')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 ${fitMode === 'fit' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100'}`}
                   >
                     <Maximize size={20} />
                     <div className="text-left">
                       <p className="font-black text-[10px] uppercase">Auto-Fit to A4</p>
                       <p className="text-[9px] font-medium opacity-60">High quality printing</p>
                     </div>
                   </button>
                   <button 
                    onClick={() => setFitMode('original')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 ${fitMode === 'original' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100'}`}
                   >
                     <LayoutGrid size={20} />
                     <div className="text-left">
                       <p className="font-black text-[10px] uppercase">Original Scale</p>
                       <p className="text-[9px] font-medium opacity-60">Maintain pixels exactly</p>
                     </div>
                   </button>
                </div>
              </section>

              <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Move size={14} className="text-red-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Reorder Pro</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Use the arrows on the thumbnails to arrange the exact sequence of your PDF pages.</p>
              </div>
            </aside>

            <main className="flex-grow bg-slate-100 p-8 lg:p-12 overflow-y-auto scrollbar-hide">
              {images.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="max-w-xl w-full aspect-video border-4 border-dashed border-slate-300 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-white transition-all group"
                  >
                    <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:scale-110 transition-all">
                      <FilePlus className="w-10 h-10 text-slate-400 group-hover:text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">Select Images</h2>
                    <p className="text-slate-400 mt-2 font-medium">JPG, PNG, or WebP formats supported</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-5xl mx-auto space-y-10">
                  <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-5">
                      <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-100">
                        <FileImage className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">{images.length} Images Loaded</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Visual Page Gallery</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase">Add More</button>
                       <button onClick={reset} className="p-2 text-slate-300 hover:text-red-600"><Trash2 size={24} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative aspect-[1/1.4] bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col group hover:shadow-xl hover:border-red-200 transition-all">
                        <div className="relative flex-grow rounded-xl overflow-hidden mb-4 bg-slate-50">
                          <img src={img.dataUrl} className="w-full h-full object-cover" alt={img.name} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Page {idx+1}</span>
                          <div className="flex space-x-1">
                            <button onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg disabled:opacity-10"><ArrowUp size={14}/></button>
                            <button onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg disabled:opacity-10"><ArrowDown size={14}/></button>
                            <button onClick={() => setImages(images.filter(i => i.id !== img.id))} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-red-50/30">
            <div className="max-w-2xl w-full bg-white rounded-[4rem] shadow-2xl p-16 text-center border-4 border-white animate-fadeIn">
              <div className="w-28 h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                <CheckCircle size={56} className="animate-bounce" />
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">PDF Assembled!</h2>
              <p className="text-lg text-slate-500 mb-12 max-w-sm mx-auto leading-relaxed font-medium">Successfully combined {images.length} images into a single professional PDF document.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={handleDownload} className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-16 rounded-2xl text-xl flex items-center justify-center shadow-2xl transition-all">
                  <Download className="mr-3" /> Download PDF
                </button>
                <button onClick={reset} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 px-12 rounded-2xl text-xl transition-all">Start Over</button>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="max-w-4xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 space-y-12 text-slate-700 leading-relaxed">
          {/* SEO Section: Introduction */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Ultimate JPG to PDF converter for Seamless Document Management</h2>
            <p className="text-lg">
              In today's fast-paced digital world, the ability to <strong>convert JPG to PDF</strong> quickly and accurately is essential for productivity. Whether you are a student, a business professional, or a casual user, our <strong>JPG to PDF converter</strong> provides a robust solution for all your document needs. We understand that maintaining the original layout and formatting is crucial when you <strong>convert JPG to PDF</strong>, which is why our engine is optimized for high-fidelity reconstruction.
            </p>
            <p className="mt-4">
              Our <strong>JPG to PDF converter</strong> is designed to be intuitive and efficient. You don't need to install any heavy software or plugins; everything happens right in your browser. When you choose to <strong>convert JPG to PDF</strong> with us, you are choosing a tool that prioritizes speed, accuracy, and user experience. Experience the power of a professional-grade <strong>JPG to PDF converter</strong> today and see how easy it is to <strong>convert JPG to PDF</strong> without any hassle.
            </p>
          </section>

          {/* SEO Section: How it Works */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Our JPG to PDF converter</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 1</h4>
                <p className="font-bold text-slate-900 mb-1">Upload Your File</p>
                <p className="text-sm">Click the upload area or drag and drop your document into our <strong>JPG to PDF converter</strong>. We support various file sizes to ensure you can <strong>convert JPG to PDF</strong> even large documents.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 2</h4>
                <p className="font-bold text-slate-900 mb-1">Process the Document</p>
                <p className="text-sm">Once uploaded, click the start button. Our <strong>JPG to PDF converter</strong> will begin analyzing the structure to <strong>convert JPG to PDF</strong> with maximum precision.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 3</h4>
                <p className="font-bold text-slate-900 mb-1">Download Result</p>
                <p className="text-sm">After the <strong>JPG to PDF converter</strong> finishes its work, your file will be ready. You can now <strong>convert JPG to PDF</strong> and download the output instantly to your device.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">Step 4</h4>
                <p className="font-bold text-slate-900 mb-1">Review and Save</p>
                <p className="text-sm">Open your new file to see the results. Our <strong>JPG to PDF converter</strong> ensures that when you <strong>convert JPG to PDF</strong>, the quality remains top-notch.</p>
              </div>
            </div>
          </section>

          {/* SEO Section: Benefits */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Benefits of Using Our JPG to PDF converter</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>High Accuracy:</strong> Our <strong>JPG to PDF converter</strong> uses advanced algorithms to ensure that every time you <strong>convert JPG to PDF</strong>, the layout stays intact.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Lightning Fast:</strong> Don't wait for minutes. Our <strong>JPG to PDF converter</strong> is optimized for speed, allowing you to <strong>convert JPG to PDF</strong> in seconds.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>No Registration:</strong> You can <strong>convert JPG to PDF</strong> without creating an account. Our <strong>JPG to PDF converter</strong> is free and accessible to everyone.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 text-red-600 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span><strong>Cross-Platform:</strong> Whether on mobile or desktop, our <strong>JPG to PDF converter</strong> works perfectly, making it easy to <strong>convert JPG to PDF</strong> anywhere.</span>
              </li>
            </ul>
          </section>

          {/* SEO Section: Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Life Use Cases for JPG to PDF converter</h3>
            <p>
              Many professionals rely on our <strong>JPG to PDF converter</strong> for their daily tasks. For instance, lawyers often need to <strong>convert JPG to PDF</strong> to edit legal documents while preserving the original structure. Similarly, students use our <strong>JPG to PDF converter</strong> to extract information from research papers. When you need to <strong>convert JPG to PDF</strong> for a presentation or a report, our tool is the most reliable choice.
            </p>
            <p className="mt-4">
              Businesses also benefit from our <strong>JPG to PDF converter</strong> by streamlining their document workflows. Instead of retyping data, they can simply <strong>convert JPG to PDF</strong> and start editing immediately. Our <strong>JPG to PDF converter</strong> is a versatile asset for any organization looking to <strong>convert JPG to PDF</strong> efficiently and securely.
            </p>
          </section>

          {/* SEO Section: Security */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Security & Privacy Assurance</h3>
            <p className="text-slate-300">
              Your privacy is our top priority. When you use our <strong>JPG to PDF converter</strong>, all processing happens locally in your browser or on secure, temporary servers. We do not store your files permanently. After you <strong>convert JPG to PDF</strong>, your data is automatically deleted. You can trust our <strong>JPG to PDF converter</strong> to handle your sensitive information with the highest level of security. We ensure that every time you <strong>convert JPG to PDF</strong>, your connection is encrypted and your files are safe.
            </p>
          </section>

          {/* SEO Section: Conclusion */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Using the Best JPG to PDF converter Today</h3>
            <p className="mb-8">
              Ready to experience the difference? Use our <strong>JPG to PDF converter</strong> now and see how simple it is to <strong>convert JPG to PDF</strong>. Join thousands of satisfied users who trust us for their document needs. Our <strong>JPG to PDF converter</strong> is always here to help you <strong>convert JPG to PDF</strong> with just a few clicks.
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
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Image Studio Engine v5.1 Active</span>
          </div>
          <div className="hidden md:block text-slate-600">Normalization & Vector Mapping Enabled</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-500 font-black">texttopdf.online</span>
        </div>
      </footer>
    </div>
  );
};

export default JpgToPdf;
