'use client';

import { CheckCircle, Heart, Shield } from 'lucide-react';

export default function CampaignBanner() {
  const reasons = [
    {
      icon: Shield,
      title: 'รัฐธรรมนูญฉบับประชาชน',
      desc: 'ร่างโดยประชาชน เพื่อประชาชน',
    },
    {
      icon: CheckCircle,
      title: 'เลือกตั้ง ส.ส. 400 เขต',
      desc: 'สะท้อนความต้องการที่แท้จริง',
    },
    {
      icon: Heart,
      title: 'กำจัดอำนาจ ส.ว.',
      desc: 'ยุติการสืบทอดอำนาจ',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          8 กุมภาพันธ์ 2569
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          โหวต <span className="font-bold text-yellow-300">&quot;เห็นชอบ&quot;</span> รัฐธรรมนูญใหม่ฉบับประชาชน
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="bg-white/10 backdrop-blur rounded-xl p-4 text-center"
          >
            <reason.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
            <h3 className="font-bold mb-1">{reason.title}</h3>
            <p className="text-sm opacity-90">{reason.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
          <CheckCircle className="w-6 h-6" />
          ร่วมกันเปลี่ยนแปลงประเทศ
        </div>
      </div>

      <p className="text-center text-sm mt-4 opacity-80">
        #8กุมภาเห็นชอบ #รัฐธรรมนูญฉบับประชาชน #กกตต้องโปร่งใส
      </p>
    </div>
  );
}
