import React, { useState } from 'react';
import { ScreenType, ExtractedScanItem } from '../types';
import { FileText, Package, QrCode, Layers, Camera, Upload, Sparkles, Loader2, Info } from 'lucide-react';
import { api } from '../services/api';

interface ScanScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onScanComplete: (items: ExtractedScanItem[]) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ onNavigate, onScanComplete }) => {
  const [scanMode, setScanMode] = useState<'receipt' | 'product' | 'barcode' | 'multi'>('receipt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleScanAction = async (file?: File) => {
    setIsProcessing(true);
    try {
      const result = await api.extractScanItems(scanMode, file);
      setIsProcessing(false);
      if (result.detected_items && result.detected_items.length > 0) {
        onScanComplete(result.detected_items);
        onNavigate('scan-review');
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleScanAction(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">📸 Haven Scan</h1>
        <p className="text-xs text-slate-500">Scan receipts or groceries to extract items for review</p>
      </div>

      {/* Development Mode Notice */}
      <div className="p-3 rounded-2xl bg-haven-50 dark:bg-haven-950/40 border border-haven-200 dark:border-haven-800 text-xs text-haven-900 dark:text-haven-100 flex items-center gap-2">
        <Info className="w-4 h-4 text-haven-600 shrink-0" />
        <span><span className="font-bold">Simulated OCR (Development Mode):</span> The API receives your image/file upload and extracts candidate items for human verification.</span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setScanMode('receipt')}
          className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
            scanMode === 'receipt'
              ? 'bg-haven-600 text-white font-bold shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Receipt</span>
        </button>

        <button
          onClick={() => setScanMode('product')}
          className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
            scanMode === 'product'
              ? 'bg-haven-600 text-white font-bold shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Package className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Product</span>
        </button>

        <button
          onClick={() => setScanMode('barcode')}
          className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
            scanMode === 'barcode'
              ? 'bg-haven-600 text-white font-bold shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <QrCode className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Barcode</span>
        </button>

        <button
          onClick={() => setScanMode('multi')}
          className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
            scanMode === 'multi'
              ? 'bg-haven-600 text-white font-bold shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Multi-Scan</span>
        </button>
      </div>

      {/* Main Camera Viewfinder Box */}
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] transition-all ${
          dragOver ? 'border-haven-600 bg-haven-50/50' : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleScanAction(e.dataTransfer.files[0]);
          }
        }}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-haven-600 animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Extracting items from image...</h3>
              <p className="text-xs text-slate-500 mt-1">Preparing candidate items for human review</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-haven-100 dark:bg-haven-900 text-haven-600 dark:text-haven-300 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {scanMode === 'receipt' && 'Align Grocery Receipt'}
                {scanMode === 'product' && 'Point Camera at Item Package'}
                {scanMode === 'barcode' && 'Center Barcode in Viewfinder'}
                {scanMode === 'multi' && 'Capture Multiple Purchases'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop a photo file or click upload below
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto pt-2">
              <button
                onClick={() => handleScanAction()}
                className="w-full py-3.5 rounded-2xl bg-haven-600 hover:bg-haven-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Simulate Camera Snap</span>
              </button>

              <label className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50">
                <Upload className="w-4 h-4" />
                <span>Upload Receipt Photo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Safety Guardrail Note */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">Human Confirmation Guardrail:</span> Extracted items are passed to the <span className="underline font-bold">Scan Review screen</span> where you can edit quantities, dates, or names before committing to your database.
        </div>
      </div>
    </div>
  );
};
