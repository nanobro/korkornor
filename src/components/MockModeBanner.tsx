'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Database } from 'lucide-react';

export default function MockModeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="แสดงข้อมูล Mock Mode"
      >
        <Database className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">🎭 Mockup Mode</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                นี่เป็นเวอร์ชั่นจำลอง ข้อมูลไม่ถูกบันทึกจริง 
                สำหรับทดสอบการใช้งานก่อนเชื่อมต่อฐานข้อมูล
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  ซ่อน
                </button>
                <a
                  href="https://github.com/vercel/next.js/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  วิธีเชื่อม Supabase →
                </a>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-blue-800/50 px-4 py-2 text-xs text-blue-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          ระบบทำงานด้วย Mock Data
        </div>
      </div>
    </div>
  );
}
