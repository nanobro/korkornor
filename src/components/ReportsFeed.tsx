'use client';

import { useState } from 'react';
import { Report } from '@/types';
import { 
  MapPin, 
  Clock, 
  ThumbsUp, 
  Bomb,
  MessageCircle,
  Share2,
  Flag,
  Filter
} from 'lucide-react';
import { formatThaiDate } from '@/lib/exif';

interface ReportWithVotes extends Report {
  userVotes: { userId: string; severityRating: number }[];
  avgSeverityRating: number;
  totalVotes: number;
}

interface ReportsFeedProps {
  reports: ReportWithVotes[];
}

const severityConfig = {
  critical: { color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', label: 'วิกฤต', emoji: '🔴' },
  high: { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', label: 'สูง', emoji: '🟠' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', label: 'ปานกลาง', emoji: '🟡' },
  low: { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', label: 'ต่ำ', emoji: '⚪' },
};

// Bomb rating component
function BombRating({ 
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

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`transition-all ${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            disabled={!onRate}
          >
            <Bomb 
              className={`w-5 h-5 ${
                star <= (hoverRating || userRating || rating)
                  ? 'fill-red-500 text-red-500'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        <span className="font-medium text-red-600">{rating.toFixed(1)}</span>
        <span> ({totalVotes} โหวต)</span>
        {userRating && (
          <span className="ml-1 text-blue-600">• คุณให้ {userRating} 💣</span>
        )}
      </div>
    </div>
  );
}

export default function ReportsFeed({ reports }: ReportsFeedProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'mostVoted' | 'highestSeverity'>('newest');
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.severity === filter;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    }
    if (sortBy === 'mostVoted') {
      return b.totalVotes - a.totalVotes;
    }
    if (sortBy === 'highestSeverity') {
      return b.avgSeverityRating - a.avgSeverityRating;
    }
    return 0;
  });

  const handleRate = (reportId: string, rating: number) => {
    setUserVotes(prev => ({ ...prev, [reportId]: rating }));
  };

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 sticky top-16 z-40">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">กรอง:</span>
          </div>
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'ทั้งหมด', count: reports.length },
              { key: 'critical', label: '🔴 วิกฤต', count: reports.filter(r => r.severity === 'critical').length },
              { key: 'high', label: '🟠 สูง', count: reports.filter(r => r.severity === 'high').length },
              { key: 'medium', label: '🟡 กลาง', count: reports.filter(r => r.severity === 'medium').length },
              { key: 'low', label: '⚪ ต่ำ', count: reports.filter(r => r.severity === 'low').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="mostVoted">โหวตเยอะสุด</option>
              <option value="highestSeverity">ความรุนแรงสูงสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.map((report) => {
          const config = severityConfig[report.severity];
          const isExpanded = expandedReports.has(report.id);
          const userRating = userVotes[report.id];
          
          return (
            <div 
              key={report.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Media Gallery */}
              {report.mediaUrls.length > 0 && (
                <div className="relative bg-gray-100">
                  <div className={`flex gap-1 overflow-x-auto ${isExpanded ? 'flex-wrap p-2' : 'p-0'}`}>
                    {report.mediaUrls.slice(0, isExpanded ? undefined : 1).map((url, index) => (
                      <div 
                        key={index} 
                        className={`flex-shrink-0 ${isExpanded ? 'w-1/3 aspect-square p-1' : 'w-full aspect-video'}`}
                      >
                        {report.mediaTypes[index] === 'video' ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Report ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {!isExpanded && report.mediaUrls.length > 1 && (
                    <button
                      onClick={() => toggleExpand(report.id)}
                      className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      +{report.mediaUrls.length - 1} รูป
                    </button>
                  )}
                </div>
              )}

              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${config.color}`}>
                      {config.emoji} {config.label}
                    </span>
                    {report.aiCategory && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {report.aiCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatThaiDate(new Date(report.reportedAt))}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-800 mb-3 leading-relaxed">{report.description}</p>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>กรุงเทพมหานคร, เขตพญาไท</span>
                </div>

                {/* AI Summary */}
                {report.aiSummary && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3 rounded-r-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">🤖 AI วิเคราะห์:</span> {report.aiSummary}
                    </p>
                  </div>
                )}

                {/* Bomb Rating - Community Voting */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-2">ประชาชนร่วมประเมินความรุนแรง 💣</p>
                  <BombRating
                    rating={report.avgSeverityRating}
                    totalVotes={report.totalVotes}
                    onRate={(rating) => handleRate(report.id, rating)}
                    userRating={userRating}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">ถูกใจ</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">ความเห็น</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">แชร์</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors ml-auto">
                    <Flag className="w-4 h-4" />
                    <span className="text-sm">รายงาน</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sortedReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">ไม่พบรายงานในหมวดหมู่นี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
