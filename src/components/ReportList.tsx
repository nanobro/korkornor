'use client';

import { Report, SeverityLevel } from '@/types';
import { formatThaiDate } from '@/lib/exif';
import { AlertTriangle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ReportListProps {
  reports: Report[];
}

const severityConfig: Record<SeverityLevel, { color: string; bgColor: string; label: string }> = {
  critical: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'วิกฤต' },
  high: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'สูง' },
  medium: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'ปานกลาง' },
  low: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'ต่ำ' },
};

const statusConfig = {
  pending: { icon: Loader2, color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'รอตรวจสอบ' },
  verified: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', label: 'ยืนยันแล้ว' },
  rejected: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', label: 'ไม่ผ่าน' },
};

export default function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>ยังไม่มีรายงานในหน่วยนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const severity = severityConfig[report.severity];
        const status = statusConfig[report.status];
        const StatusIcon = status.icon;

        return (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Media Gallery */}
            {report.mediaUrls.length > 0 && (
              <div className="flex gap-2 p-3 bg-gray-50 overflow-x-auto">
                {report.mediaUrls.map((url, index) => (
                  <div key={index} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                    {report.mediaTypes[index] === 'video' ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Report ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severity.bgColor} ${severity.color}`}>
                    {severity.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bgColor} ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                {report.aiCategory && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {report.aiCategory}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-800 mb-3">{report.description}</p>

              {/* AI Summary */}
              {report.aiSummary && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">AI วิเคราะห์:</span> {report.aiSummary}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>รายงาน: {formatThaiDate(new Date(report.reportedAt))}</span>
                </div>
                {report.incidentTime && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>เหตุการณ์: {formatThaiDate(new Date(report.incidentTime))}</span>
                  </div>
                )}
              </div>

              {report.duplicateOf && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">
                  รายงานนี้อาจซ้ำกับรายงานอื่น
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
