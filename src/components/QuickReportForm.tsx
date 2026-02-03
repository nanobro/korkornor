'use client';

import { useState, useCallback } from 'react';
import { Upload, X, MapPin, Camera, Video, AlertTriangle, Send } from 'lucide-react';
import { SeverityLevel } from '@/types';

interface QuickReportFormProps {
  onSubmit?: (data: {
    description: string;
    location: string;
    severity: SeverityLevel;
    files: File[];
  }) => Promise<void>;
}

const severityOptions: { value: SeverityLevel; label: string; color: string; emoji: string }[] = [
  { value: 'low', label: 'ต่ำ', color: 'bg-blue-500', emoji: '⚪' },
  { value: 'medium', label: 'ปานกลาง', color: 'bg-yellow-500', emoji: '🟡' },
  { value: 'high', label: 'สูง', color: 'bg-orange-500', emoji: '🟠' },
  { value: 'critical', label: 'วิกฤต', color: 'bg-red-600', emoji: '🔴' },
];

export default function QuickReportForm({ onSubmit }: QuickReportFormProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024;
      return (isImage || isVideo) && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      name: file.name,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) return;

    setIsSubmitting(true);
    
    // Mock submit
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setDescription('');
      setLocation('');
      setSeverity('medium');
      setFiles([]);
      setPreviews([]);
    }, 2000);
    
    setIsSubmitting(false);
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">ส่งรายงานสำเร็จ!</h3>
        <p className="text-green-600">ขอบคุณที่ร่วมจับตา กกต. 🙏</p>
        <p className="text-xs text-green-500 mt-2">(Mockup mode - ยังไม่บันทึกจริง)</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          รายงานเหตุการณ์
        </h2>
        <p className="text-sm text-white/80">แจ้งปัญหาที่พบ 8 ก.พ. 2569</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รายละเอียดเหตุการณ์
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="อธิบายสิ่งที่เกิดขึ้น... (เช่น เครื่องลงคะแนนเสีย, บัตรไม่พอ, เปิดหน่วยล่าช้า)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            สถานที่ (จังหวัด/เขต/หน่วย)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น กรุงเทพมหานคร, เขตพญาไท, หน่วยที่ 5"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Severity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ระดับความรุนแรงที่คุณประเมิน
          </label>
          <div className="grid grid-cols-4 gap-2">
            {severityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSeverity(option.value)}
                className={`p-2 rounded-xl border-2 text-center transition-all ${
                  severity === option.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-1" />
            รูปภาพ / วิดีโอ (อัปโหลดได้หลายไฟล์)
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-red-400 transition-colors bg-gray-50">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="quick-file-upload"
            />
            <label htmlFor="quick-file-upload" className="cursor-pointer block">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">แตะเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
              <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG, MP4 (สูงสุด 50MB ต่อไฟล์)</p>
            </label>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  {preview.type === 'image' ? (
                    <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={preview.url} className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !description.trim()}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isSubmitting ? 'กำลังส่ง...' : '🚨 ส่งรายงาน'}
        </button>

        <p className="text-center text-xs text-gray-400">
          ข้อมูลจะถูกตรวจสอบก่อนแสดงผล
        </p>
      </div>
    </form>
  );
}
