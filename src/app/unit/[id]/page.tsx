'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ElectionUnit, Report, ReportSubmission } from '@/types';
import { getElectionUnitById, getReportsByUnitId, createReport } from '@/lib/supabase';
import ReportForm from '@/components/ReportForm';
import ReportList from '@/components/ReportList';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Users, 
  ArrowLeft, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Share2
} from 'lucide-react';

const ElectionMap = dynamic(() => import('@/components/ElectionMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />,
});

const severityColors = {
  critical: 'bg-red-600',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-400',
};

const severityLabels = {
  critical: 'วิกฤต',
  high: 'สูง',
  medium: 'ปานกลาง',
  low: 'ต่ำ',
};

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params.id as string;
  
  const [unit, setUnit] = useState<ElectionUnit | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadUnitData();
  }, [unitId]);

  const loadUnitData = async () => {
    try {
      const [unitData, reportsData] = await Promise.all([
        getElectionUnitById(unitId),
        getReportsByUnitId(unitId),
      ]);
      setUnit(unitData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading unit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (submission: ReportSubmission) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('unitId', submission.unitId);
    formData.append('description', submission.description);
    formData.append('severity', submission.severity);
    if (submission.incidentTime) {
      formData.append('incidentTime', submission.incidentTime);
    }
    
    submission.files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    const response = await fetch('/api/reports', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to submit report');
    }

    // Reload reports
    await loadUnitData();
    setShowReportForm(false);
    setSubmitSuccess(true);
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `korkornor - ${unit?.province} หน่วย ${unit?.unitNumber}`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('คัดลอกลิงก์แล้ว');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">ไม่พบหน่วยเลือกตั้งนี้</p>
          <a href="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  // Calculate severity distribution
  const severityCount = {
    critical: reports.filter(r => r.severity === 'critical').length,
    high: reports.filter(r => r.severity === 'high').length,
    medium: reports.filter(r => r.severity === 'medium').length,
    low: reports.filter(r => r.severity === 'low').length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">กลับหน้าหลัก</span>
            </a>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Unit Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{unit.province}</h1>
                <p className="text-white/90 mt-1">{unit.district}</p>
                <p className="text-white/80 text-sm">{unit.subDistrict}</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <p className="text-3xl font-bold">{unit.unitNumber}</p>
                  <p className="text-xs opacity-80">หน่วยที่</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{unit.voterCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">ผู้มีสิทธิ</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{reports.length}</p>
                <p className="text-xs text-gray-500">รายงาน</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{unit.severityScore}</p>
                <p className="text-xs text-gray-500">คะแนนความรุนแรง</p>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        {reports.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">สถิติรายงาน</h2>
            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(severityCount) as Array<keyof typeof severityCount>).map((sev) => (
                <div key={sev} className="text-center">
                  <div className={`${severityColors[sev]} text-white rounded-lg p-3 mb-2`}>
                    <p className="text-xl font-bold">{severityCount[sev]}</p>
                  </div>
                  <p className="text-xs text-gray-500">{severityLabels[sev]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Map */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ตำแหน่งหน่วย</h2>
          <div className="h-[300px] rounded-lg overflow-hidden">
            <ElectionMap selectedUnitId={unit.id} />
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">ส่งรายงานสำเร็จ</p>
              <p className="text-sm text-green-600">รายงานของคุณถูกบันทึกและกำลังรอการตรวจสอบ</p>
            </div>
          </div>
        )}

        {/* Report Form Toggle */}
        {!showReportForm && (
          <button
            onClick={() => setShowReportForm(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">รายงานเหตุการณ์ที่หน่วยนี้</span>
          </button>
        )}

        {/* Report Form */}
        {showReportForm && (
          <ReportForm
            unit={unit}
            onSubmit={handleSubmitReport}
            onCancel={() => setShowReportForm(false)}
          />
        )}

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            รายงานทั้งหมด ({reports.length})
          </h2>
          <ReportList reports={reports} />
        </div>
      </div>
    </main>
  );
}
