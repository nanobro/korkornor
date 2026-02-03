'use client';

import { useState, useEffect } from 'react';

export default function Countdown() {
  const targetDate = new Date('2026-02-08T08:00:00+07:00'); // 8 AM Bangkok time
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-red-600 text-white text-3xl md:text-5xl font-bold w-16 md:w-24 h-16 md:h-24 rounded-lg flex items-center justify-center shadow-lg">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-sm md:text-base mt-2 text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 py-8 px-4 rounded-2xl border border-red-100">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-red-800">
          ⏰ นับถอยหลังสู่วันประชามติ
        </h2>
        <p className="text-red-600 mt-1">8 กุมภาพันธ์ 2569 - รัฐธรรมนูญใหม่ฉบับประชาชน</p>
      </div>
      
      <div className="flex justify-center gap-3 md:gap-6">
        <TimeBox value={timeLeft.days} label="วัน" />
        <span className="text-3xl md:text-5xl font-bold text-red-400 self-start mt-4">:</span>
        <TimeBox value={timeLeft.hours} label="ชั่วโมง" />
        <span className="text-3xl md:text-5xl font-bold text-red-400 self-start mt-4">:</span>
        <TimeBox value={timeLeft.minutes} label="นาที" />
        <span className="text-3xl md:text-5xl font-bold text-red-400 self-start mt-4">:</span>
        <TimeBox value={timeLeft.seconds} label="วินาที" />
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-md">
          ✓ 8 กุมภา กา &quot;เห็นชอบ&quot;
        </span>
      </div>
    </div>
  );
}
