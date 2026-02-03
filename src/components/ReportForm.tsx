'use client';

import { useState, useCallback } from 'react';
import { ReportSubmission, SeverityLevel, ElectionUnit } from '@/types';
import { uploadMultipleFiles } from '@/lib/blob';
import { extractDateFromImage, formatISODate } from '@/lib/exif';
import { Upload, X, AlertTriangle, Camera, Video } from 'lucide-react';

interface ReportFormProps {
  unit: ElectionUnit;
  onSubmit: (report: ReportSubmission) => Promise<void>;
  onCancel: () => void;
}

const severityOptions: { value: SeverityLevel; label: string; color: string; desc: string }[] = [
  { value: 'critical', label: 'วิกฤต', color: 'bg-red-600', desc: 'ทุจริตร้ายแรง ส่งผลต่อผลการเลือกตั้ง' },
  { value: 'high', label: 'สูง', color: 'bg-orange-500', desc: 'ปัญหาร้ายแรงที่อาจกระทบผล' },
  { value: 'medium', label: 'ปานกลาง', color: 'bg-yellow-500', desc: 'ปัญหาที่มีผลกระทบปานกลาง' },
  { value: 'low', label: 'ต่ำ', color: 'bg-blue-400', desc: 'ปัญหาเล็กน้อย' },
];

export default function ReportForm({ unit, onSubmit, onCancel }: ReportFormProps) {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [incidentTime, setIncidentTime] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return (isImage || isVideo) && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('บางไฟล์ไม่รองรับ หรือมีขนาดใหญ่เกิน 50MB');
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Create previews
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);

    // Try to extract date from first image
    if (validFiles.length > 0) {
      const firstImage = validFiles.find(f => f.type.startsWith('image/'));
      if (firstImage && !incidentTime) {
        const date = await extractDateFromImage(firstImage);
        if (date) {
          setIncidentTime(formatISODate(date));
        }
      }
    }
  }, [incidentTime]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('กรุณากรอกรายละเอียด');
      return;
    }

    if (files.length === 0) {
      setError('กรุณาแนบรูปภาพหรือวิดีโออย่างน้อย 1 ไฟล์');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        unitId: unit.id,
        description,
        severity,
        incidentTime: incidentTime || undefined,
        files,
      });
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">รายงานเหตุการณ์</h2>
          <p className="text-sm text-gray-500">
            {unit.province} · {unit.district} · หน่วย {unit.unitNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Severity Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ระดับความรุนแรง
        </label>
        <div className="grid grid-cols-2 gap-3">
          {severityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSeverity(option.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                severity === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full ${option.color}`} />
                <span className="font-medium text-gray-800">{option.label}</span>
              </div>
              <p className="text-xs text-gray-500">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รายละเอียดเหตุการณ์
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายสิ่งที่เกิดขึ้น..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Incident Time */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          เวลาที่เกิดเหตุ (ถ้าทราบ)
        </label>
        <input
          type="datetime-local"
          value={incidentTime}
          onChange={(e) => setIncidentTime(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          หากไม่ระบุ ระบบจะพยายามดึงเวลาจากรูปภาพ (EXIF)
        </p>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รูปภาพ / วิดีโอ
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
            <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG, MP4 (สูงสุด 50MB)</p>
          </label>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                {preview.type === 'image' ? (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 p-1 bg-black/50 rounded">
                  {preview.type === 'image' ? (
                    <Camera className="w-3 h-3 text-white" />
                  ) : (
                    <Video className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'กำลังส่ง...' : 'ส่งรายงาน'}
        </button>
      </div>
    </form>
  );
}
