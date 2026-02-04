'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Countdown from '@/components/Countdown';
// import CampaignBanner from '@/components/CampaignBanner';
import QuickReportForm from '@/components/QuickReportForm';
import ReportsFeed from '@/components/ReportsFeed';
import InfoBanner from '@/components/InfoBanner';
import { DashboardStats, ElectionUnit, Report } from '@/types';
import { getDashboardStats, getElectionUnits, getAllReports } from '@/lib/supabase';
import { AlertTriangle, TrendingUp, MapPin, Users, Bomb } from 'lucide-react';

// Dynamic import for map (client-side only)
const ElectionMap = dynamic(() => import('@/components/ElectionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-gray-500">กำลังโหลดแผนที่...</div>
    </div>
  ),
});

// Mock reports with votes for feed - v0.2
const mockReportsWithVotes = [
  {
    id: 'r1',
    unitId: '1',
    locationName: 'กรุงเทพมหานคร, เขตพญาไท, หน่วยที่ 5',
    description: 'เครื่องลงคะแนนเสีย ผู้มีสิทธิต้องรอนานกว่า 1 ชั่วโมง บางคนถึงกับยอมกลับบ้านเพราะรอไม่ไหว ทั้งๆ ที่มีสิทธิเลือกตั้งเต็มที่',
    severity: 'high' as const,
    mediaUrls: ['https://images.unsplash.com/photo-1540910419834-31352bafdb89?w=800&h=600&fit=crop'],
    mediaTypes: ['image'] as ('image' | 'video')[],
    reportedAt: '2026-02-08T09:30:00Z',
    incidentTime: '2026-02-08T08:15:00Z',
    aiCategory: 'เครื่องลงคะแนนเสีย',
    aiSummary: 'เครื่องลงคะแนนมีปัญหา',
    status: 'verified' as const,
    userVotes: [{ userId: 'u1', rating: 4 }, { userId: 'u2', rating: 4 }],
    avgRating: 4,
    totalVotes: 42,
  },
  {
    id: 'r2',
    unitId: '5',
    locationName: 'กรุงเทพมหานคร, เขตลาดพร้าว, หน่วยที่ 12',
    description: 'พบการขัดขวางผู้มีสิทธิเลือกตั้ง มีการเรียกร้องให้แสดงเอกสารเพิ่มเติมที่ไม่จำเป็น และมีการพูดจาข่มขู่',
    severity: 'critical' as const,
    mediaUrls: [
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591848478625-de43268e6fb8?w=800&h=600&fit=crop',
    ],
    mediaTypes: ['image', 'image'] as ('image' | 'video')[],
    reportedAt: '2026-02-08T11:00:00Z',
    incidentTime: '2026-02-08T10:30:00Z',
    aiCategory: 'การขัดขวางผู้มีสิทธิ',
    aiSummary: 'มีการกีดกันผู้มีสิทธิ',
    status: 'verified' as const,
    userVotes: [{ userId: 'u3', rating: 5 }, { userId: 'u4', rating: 5 }],
    avgRating: 5,
    totalVotes: 89,
  },
  {
    id: 'r3',
    unitId: '11',
    locationName: 'ขอนแก่น, เมืองขอนแก่น, หน่วยที่ 8',
    description: 'บัตรเลือกตั้งไม่เพียงพอ ต้องรอบัตรเพิ่มจากหน่วยงาน ใช้เวลานานมาก',
    severity: 'medium' as const,
    mediaUrls: [],
    mediaTypes: [],
    reportedAt: '2026-02-08T10:15:00Z',
    incidentTime: '2026-02-08T09:00:00Z',
    aiCategory: 'บัตรไม่เพียงพอ',
    aiSummary: 'บัตรหมดก่อนเวลา',
    status: 'pending' as const,
    userVotes: [{ userId: 'u5', rating: 3 }],
    avgRating: 3,
    totalVotes: 15,
  },
  {
    id: 'r4',
    unitId: '3',
    locationName: 'กรุงเทพมหานคร, เขตราชเทวี, หน่วยที่ 3',
    description: 'เจ้าหน้าที่ไม่พร้อม เปิดหน่วยล่าช้า 30 นาที แถมยังไม่มีคำชี้แจงให้ประชาชนที่มารอ',
    severity: 'medium' as const,
    mediaUrls: ['https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800&h=600&fit=crop'],
    mediaTypes: ['image'] as ('image' | 'video')[],
    reportedAt: '2026-02-08T08:45:00Z',
    incidentTime: '2026-02-08T08:00:00Z',
    aiCategory: 'เปิดหน่วยล่าช้า',
    aiSummary: 'เปิดหน่วยล่าช้า',
    status: 'verified' as const,
    userVotes: [],
    avgRating: 3,
    totalVotes: 23,
  },
  {
    id: 'r5',
    unitId: '24',
    locationName: 'สงขลา, หาดใหญ่, หน่วยที่ 15',
    description: 'น้ำท่วมหนัก ผู้มีสิทธิเดินทางมาลงคะแนนลำบาก แต่ กกต. ไม่มีมาตรการช่วยเหลือ',
    severity: 'high' as const,
    mediaUrls: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=600&fit=crop'],
    mediaTypes: ['image'] as ('image' | 'video')[],
    reportedAt: '2026-02-08T12:00:00Z',
    incidentTime: '2026-02-08T11:30:00Z',
    aiCategory: 'ภัยธรรมชาติ',
    aiSummary: 'น้ำท่วมกระทบการเลือกตั้ง',
    status: 'pending' as const,
    userVotes: [{ userId: 'u6', rating: 4 }],
    avgRating: 4,
    totalVotes: 56,
  },
];

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUnits: 95000,
    totalReports: 127,
    criticalReports: 8,
    highReports: 23,
    mediumReports: 45,
    lowReports: 51,
    unitsWithIssues: 89,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-1.5 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">korkornor</h1>
              <div className="flex items-center gap-1">
                <p className="text-[10px] text-gray-500">จับตา กกต. · 8 ก.พ. 2569</p>
                <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded font-medium">
                  MOCK
                </span>
              </div>
            </div>
          </div>
          <a
            href="https://twitter.com/hashtag/8กุมภาเห็นชอบ"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            #8กุมภากาเห็นชอบ
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Countdown */}
        <Countdown />

        {/* Info Banner - อธิบายว่าเว็บนี้คืออะไร */}
        <InfoBanner />

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-red-600">{stats.totalReports}</p>
            <p className="text-[10px] text-gray-500">รายงาน</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-orange-600">{stats.criticalReports + stats.highReports}</p>
            <p className="text-[10px] text-gray-500">รุนแรง</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-blue-600">{stats.unitsWithIssues}</p>
            <p className="text-[10px] text-gray-500">หน่วยมีปัญหา</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-purple-600">1.2K</p>
            <p className="text-[10px] text-gray-500">โหวต💣</p>
          </div>
        </div>

        {/* Quick Report Form - TOP SECTION */}
        <section>
          <QuickReportForm />
        </section>

        {/* Map Preview (Collapsible) */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              แผนที่หน่วยเลือกตั้ง
            </h2>
            <a href="#" className="text-xs text-blue-600">ดูทั้งหมด →</a>
          </div>
          <div className="h-[200px] rounded-lg overflow-hidden">
            <ElectionMap />
          </div>
        </div>

        {/* Reports Feed - BOTTOM SECTION */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Feed ปัญหาล่าสุด
            </h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Bomb className="w-4 h-4 text-red-500" />
              <span>ประเมินความรุนแรงได้</span>
            </div>
          </div>
          
          <ReportsFeed reports={mockReportsWithVotes as any} />
        </section>

        {/* Load More */}
        <div className="text-center py-4">
          <button className="px-6 py-2 bg-white text-gray-600 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50">
            โหลดเพิ่ม...
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            korkornor - แพลตฟอร์มจับตา กกต. โดยประชาชน
          </p>
          <p className="text-gray-500 text-xs mt-1">
            ไม่ได้สังกัดหรือได้รับการสนับสนุนจากหน่วยงานใด
          </p>
          <div className="mt-3 flex justify-center gap-2 text-xs">
            <span className="text-gray-400">#8กุมภาเห็นชอบ</span>
            <span className="text-gray-400">#รัฐธรรมนูญฉบับประชาชน</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
