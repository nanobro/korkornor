'use client';

import { useState } from 'react';
import { AlertTriangle, X, Info, Megaphone } from 'lucide-react';

export default function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 rounded-2xl shadow-lg overflow-hidden text-white">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="hidden sm:flex w-14 h-14 bg-white/20 rounded-xl items-center justify-center flex-shrink-0">
            <Megaphone className="w-7 h-7" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">korkornor คืออะไร?</h2>
              <span className="bg-yellow-400 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                BETA
              </span>
            </div>
            
            <p className="text-white/90 text-sm leading-relaxed mb-3">
              แพลตฟอร์มประชาชนสำหรับ <strong className="text-yellow-300">รายงานความผิดพลาด</strong> และ 
              <strong className="text-yellow-300"> ติดตามการทำงานของ กกต.</strong> ในวันที่{' '}
              <strong>8 กุมภาพันธ์ 2569</strong> วันประชามติรัฐธรรมนูญใหม่ฉบับประชาชน
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <span className="text-lg">📸</span>
                <span>แจ้งปัญหาพร้อมรูป/วิดีโอ</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <span className="text-lg">💣</span>
                <span>ประเมินความรุนแรงร่วมกัน</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <span>ติดตามแผนที่ real-time</span>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="bg-white/20 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-yellow-300 font-bold">เป้าหมาย:</span> รวบรวมหลักฐานความผิดพลาดของ กกต. ให้ประชาชนตรวจสอบได้
              </div>
              <a
                href="https://www.ect.go.th/ect_th/th/board-of-director/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-100 transition-colors flex items-center gap-1"
              >
                อยากรู้จัก กกต? →
              </a>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/20 px-5 py-2 flex items-center justify-between">
        <p className="text-xs text-white/80">
          <Info className="w-3 h-3 inline mr-1" />
          ไม่สังกัดหรือได้รับการสนับสนุนจากหน่วยงานใด • สร้างโดยประชาชน เพื่อประชาชน
        </p>
        <p className="text-xs text-yellow-300 font-medium">
          #จับตา8กุมภา
        </p>
      </div>
    </div>
  );
}
