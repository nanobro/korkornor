'use client';

import { DashboardStats, SeverityLevel } from '@/types';
import { AlertTriangle, MapPin, ClipboardList, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  stats: DashboardStats;
}

const severityConfig: Record<SeverityLevel, { color: string; label: string; icon: string }> = {
  critical: { color: 'bg-red-600', label: 'วิกฤต', icon: '🔴' },
  high: { color: 'bg-orange-500', label: 'สูง', icon: '🟠' },
  medium: { color: 'bg-yellow-500', label: 'ปานกลาง', icon: '🟡' },
  low: { color: 'bg-blue-400', label: 'ต่ำ', icon: '🔵' },
};

export default function StatsCard({ stats }: StatsCardProps) {
  const cards = [
    {
      title: 'หน่วยเลือกตั้งทั้งหมด',
      value: stats.totalUnits.toLocaleString(),
      icon: MapPin,
      color: 'bg-blue-500',
    },
    {
      title: 'หน่วยที่มีปัญหา',
      value: stats.unitsWithIssues.toLocaleString(),
      icon: AlertTriangle,
      color: 'bg-orange-500',
    },
    {
      title: 'รายงานทั้งหมด',
      value: stats.totalReports.toLocaleString(),
      icon: ClipboardList,
      color: 'bg-purple-500',
    },
    {
      title: 'อัตราหน่วยมีปัญหา',
      value: `${((stats.unitsWithIssues / stats.totalUnits) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Severity Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">สถิติตามระดับความรุนแรง</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['critical', 'high', 'medium', 'low'] as SeverityLevel[]).map((severity) => {
            const config = severityConfig[severity];
            const count = 
              severity === 'critical' ? stats.criticalReports :
              severity === 'high' ? stats.highReports :
              severity === 'medium' ? stats.mediumReports :
              stats.lowReports;
            
            return (
              <div key={severity} className="text-center p-4 rounded-lg bg-gray-50">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${config.color} text-white text-xl mb-2`}>
                  {config.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-sm text-gray-500">{config.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
