'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Countdown from '@/components/Countdown';
import StatsCard from '@/components/StatsCard';
import CampaignBanner from '@/components/CampaignBanner';
import { DashboardStats, ElectionUnit } from '@/types';
import { getDashboardStats, getElectionUnits } from '@/lib/supabase';
import { MapPin, AlertTriangle, Info } from 'lucide-react';

// Dynamic import for map (client-side only)
const ElectionMap = dynamic(() => import('@/components/ElectionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-gray-500">กำลังโหลดแผนที่...</div>
    </div>
  ),
});

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUnits: 0,
    totalReports: 0,
    criticalReports: 0,
    highReports: 0,
    mediumReports: 0,
    lowReports: 0,
    unitsWithIssues: 0,
  });
  const [units, setUnits] = useState<ElectionUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<ElectionUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, unitsData] = await Promise.all([
        getDashboardStats(),
        getElectionUnits(),
      ]);
      setStats(statsData);
      setUnits(unitsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitSelect = (unit: ElectionUnit) => {
    setSelectedUnit(unit);
    window.location.href = `/unit/${unit.id}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">korkornor</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">จับตา กกต. · 8 ก.พ. 2569</p>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                  MOCK
                </span>
              </div>
            </div>
          </div>
          <a
            href="https://twitter.com/hashtag/8กุมภาเห็นชอบ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            #8กุมภาเห็นชอบ
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Countdown */}
        <Countdown />

        {/* Campaign Banner */}
        <CampaignBanner />

        {/* Stats */}
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : (
          <StatsCard stats={stats} />
        )}

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                แผนที่หน่วยเลือกตั้ง
              </h2>
              <p className="text-sm text-gray-500">
                คลิกที่จุดเพื่อดูรายละเอียดและรายงานเหตุการณ์
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.totalUnits.toLocaleString()}</p>
              <p className="text-xs text-gray-500">หน่วยทั่วประเทศ</p>
            </div>
          </div>
          <ElectionMap onUnitSelect={handleUnitSelect} />
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ค้นหาหน่วยเลือกตั้ง</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">เลือกจังหวัด</option>
              {Array.from(new Set(units.map(u => u.province))).sort().map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">เลือกอำเภอ</option>
            </select>
            <input
              type="text"
              placeholder="หมายเลขหน่วย"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 border-dashed">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-blue-900">เกี่ยวกับ korkornor</h3>
                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                  MOCKUP VERSION
                </span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                korkornor เป็นแพลตฟอร์มประชาชนที่ให้ทุกคนสามารถร่วมกันจับตาดูการทำงานของ 
                กกต. ในวันที่ 8 กุมภาพันธ์ 2569 วันประชามติรัฐธรรมนูญใหม่ฉบับประชาชน 
                หากพบเห็นความผิดปกติ สามารถถ่ายรูป/วิดีโอ และรายงานผ่านเว็บไซต์นี้ได้ทันที 
                ระบบ AI จะช่วยวิเคราะห์และจัดหมวดหมู่รายงานโดยอัตโนมัติ
              </p>
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800">
                  <strong>⚠️ สถานะปัจจุบัน:</strong> ระบบกำลังอยู่ในโหมดจำลอง (Mockup) 
                  ข้อมูลที่แสดงเป็นข้อมูลตัวอย่าง การรายงานจะไม่ถูกบันทึกลงฐานข้อมูลจริง 
                  ระบบจะพร้อมใช้งานจริงเมื่อเชื่อมต่อกับ Supabase
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  #กกตโปร่งใส
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  #8กุมภาเห็นชอบ
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  #รัฐธรรมนูญฉบับประชาชน
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            korkornor - แพลตฟอร์มจับตา กกต. โดยประชาชน
          </p>
          <p className="text-gray-500 text-xs mt-2">
            ไม่ได้สังกัดหรือได้รับการสนับสนุนจากหน่วยงานใด
          </p>
        </div>
      </footer>
    </main>
  );
}
