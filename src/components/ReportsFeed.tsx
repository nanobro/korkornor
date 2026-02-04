'use client';

import { useState } from 'react';
import { Report } from '@/types';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Facebook,
  MessageCircle,
  ThumbsUp,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { formatThaiDate } from '@/lib/exif';

interface ReportWithVotes extends Report {
  locationName: string;
  userVotes: { userId: string; rating: number }[];
  avgRating: number;
  totalVotes: number;
}

interface ReportsFeedProps {
  reports: ReportWithVotes[];
}

const severityConfig = {
  critical: { color: 'bg-red-600', text: 'text-red-600', label: 'วิกฤต' },
  high: { color: 'bg-orange-500', text: 'text-orange-500', label: 'สูง' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-500', label: 'กลาง' },
  low: { color: 'bg-blue-500', text: 'text-blue-500', label: 'ต่ำ' },
};

// Star Rating Component
function StarRating({ 
  rating, 
  totalVotes,
  onRate,
  userRating 
}: { 
  rating: number; 
  totalVotes: number;
  onRate?: (rating: number) => void;
  userRating?: number;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = userRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            onMouseEnter={() => onRate && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={!onRate}
            className={`${onRate ? 'cursor-pointer' : 'cursor-default'} p-0.5`}
          >
            <Star 
              className={`w-4 h-4 ${
                star <= (hoverRating || displayRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500">({totalVotes})</span>
      {userRating && <span className="text-[10px] text-blue-600 ml-1">คุณโหวตแล้ว</span>}
    </div>
  );
}

// Truncate text
function truncateText(text: string, maxLength: number = 80) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function ReportsFeed({ reports }: ReportsFeedProps) {
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  const [expandedText, setExpandedText] = useState<Set<string>>(new Set());
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const toggleExpand = (reportId: string) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const toggleText = (reportId: string) => {
    setExpandedText(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const handleRate = (reportId: string, rating: number) => {
    setUserVotes(prev => ({ ...prev, [reportId]: rating }));
  };

  const shareToFacebook = (report: ReportWithVotes) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`รายงานจาก korkornor: ${report.description.substring(0, 100)}...`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {reports.map((report) => {
        const config = severityConfig[report.severity];
        const isExpanded = expandedReports.has(report.id);
        const isTextExpanded = expandedText.has(report.id);
        const userRating = userVotes[report.id];
        const hasImages = report.mediaUrls.length > 0;
        
        return (
          <div 
            key={report.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header: Location & Rating */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-start justify-between gap-2">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 flex-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{report.locationName}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium text-white ${config.color} flex-shrink-0`}>
                    {config.label}
                  </span>
                </div>
                
                {/* Star Rating */}
                <div className="flex-shrink-0">
                  <StarRating
                    rating={report.avgRating}
                    totalVotes={report.totalVotes}
                    onRate={(rating) => handleRate(report.id, rating)}
                    userRating={userRating}
                  />
                </div>
              </div>
            </div>

            {/* Description - 1 line, expandable */}
            <div className="px-4 pb-2">
              <p className="text-sm text-gray-800 leading-relaxed">
                {isTextExpanded ? report.description : truncateText(report.description)}
                {report.description.length > 80 && (
                  <button
                    onClick={() => toggleText(report.id)}
                    className="text-blue-600 text-xs ml-1 hover:underline"
                  >
                    {isTextExpanded ? 'ย่อ' : 'อ่านเพิ่ม'}
                  </button>
                )}
              </p>
            </div>

            {/* Images - Collapsible */}
            {hasImages && (
              <div className="border-t border-gray-100">
                <button
                  onClick={() => toggleExpand(report.id)}
                  className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>ดูรูปภาพ ({report.mediaUrls.length})</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-3 gap-2">
                      {report.mediaUrls.map((url, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
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
                  </div>
                )}
              </div>
            )}

            {/* Footer: Actions */}
            <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-xs">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>ถูกใจ</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors text-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>คอมเมนต์</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">
                  {formatThaiDate(new Date(report.reportedAt)).split(' ')[0]}
                </span>
                <button 
                  onClick={() => shareToFacebook(report)}
                  className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-3 h-3" />
                  <span>แชร์</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
