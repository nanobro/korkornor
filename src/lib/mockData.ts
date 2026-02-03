import { ElectionUnit, Report, DashboardStats } from '@/types';

// Mock Election Units - จำลองหน่วยเลือกตั้งทั่วประเทศ
export const mockElectionUnits: ElectionUnit[] = [
  // กรุงเทพมหานคร
  { id: '1', province: 'กรุงเทพมหานคร', district: 'เขตพญาไท', subDistrict: 'สามเสนใน', unitNumber: 1, latitude: 13.7563, longitude: 100.5018, voterCount: 523, reportsCount: 2, severityScore: 75 },
  { id: '2', province: 'กรุงเทพมหานคร', district: 'เขตพญาไท', subDistrict: 'สามเสนใน', unitNumber: 2, latitude: 13.7580, longitude: 100.5030, voterCount: 498, reportsCount: 0, severityScore: 0 },
  { id: '3', province: 'กรุงเทพมหานคร', district: 'เขตราชเทวี', subDistrict: 'ถนนพญาไท', unitNumber: 1, latitude: 13.7540, longitude: 100.5220, voterCount: 612, reportsCount: 1, severityScore: 50 },
  { id: '4', province: 'กรุงเทพมหานคร', district: 'เขตราชเทวี', subDistrict: 'ถนนพญาไท', unitNumber: 2, latitude: 13.7550, longitude: 100.5240, voterCount: 587, reportsCount: 0, severityScore: 0 },
  { id: '5', province: 'กรุงเทพมหานคร', district: 'เขตลาดพร้าว', subDistrict: 'ลาดพร้าว', unitNumber: 1, latitude: 13.8070, longitude: 100.5730, voterCount: 745, reportsCount: 3, severityScore: 100 },
  { id: '6', province: 'กรุงเทพมหานคร', district: 'เขตวังทองหลาง', subDistrict: 'วังทองหลาง', unitNumber: 1, latitude: 13.7800, longitude: 100.6100, voterCount: 634, reportsCount: 1, severityScore: 50 },
  
  // ภาคเหนือ
  { id: '7', province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subDistrict: 'ศรีภูมิ', unitNumber: 1, latitude: 18.7883, longitude: 98.9853, voterCount: 445, reportsCount: 0, severityScore: 0 },
  { id: '8', province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subDistrict: 'ศรีภูมิ', unitNumber: 2, latitude: 18.7890, longitude: 98.9870, voterCount: 412, reportsCount: 1, severityScore: 25 },
  { id: '9', province: 'เชียงราย', district: 'เมืองเชียงราย', subDistrict: 'เวียง', unitNumber: 1, latitude: 19.9072, longitude: 99.8328, voterCount: 389, reportsCount: 0, severityScore: 0 },
  { id: '10', province: 'น่าน', district: 'เมืองน่าน', subDistrict: 'ในเวียง', unitNumber: 1, latitude: 18.7756, longitude: 100.7731, voterCount: 298, reportsCount: 0, severityScore: 0 },
  
  // ภาคตะวันออกเฉียงเหนือ
  { id: '11', province: 'ขอนแก่น', district: 'เมืองขอนแก่น', subDistrict: 'ในเมือง', unitNumber: 1, latitude: 16.4322, longitude: 102.8236, voterCount: 567, reportsCount: 2, severityScore: 75 },
  { id: '12', province: 'ขอนแก่น', district: 'เมืองขอนแก่น', subDistrict: 'ในเมือง', unitNumber: 2, latitude: 16.4330, longitude: 102.8250, voterCount: 534, reportsCount: 0, severityScore: 0 },
  { id: '13', province: 'อุดรธานี', district: 'เมืองอุดรธานี', subDistrict: 'หมากแข้ง', unitNumber: 1, latitude: 17.4138, longitude: 102.7876, voterCount: 478, reportsCount: 1, severityScore: 50 },
  { id: '14', province: 'นครราชสีมา', district: 'เมืองนครราชสีมา', subDistrict: 'ในเมือง', unitNumber: 1, latitude: 14.9799, longitude: 102.0977, voterCount: 623, reportsCount: 0, severityScore: 0 },
  { id: '15', province: 'อุบลราชธานี', district: 'เมืองอุบลราชธานี', subDistrict: 'ในเมือง', unitNumber: 1, latitude: 15.2287, longitude: 104.8564, voterCount: 445, reportsCount: 0, severityScore: 0 },
  
  // ภาคกลาง
  { id: '16', province: 'ชลบุรี', district: 'เมืองชลบุรี', subDistrict: 'บางปลาสร้อย', unitNumber: 1, latitude: 13.3611, longitude: 100.9847, voterCount: 534, reportsCount: 1, severityScore: 50 },
  { id: '17', province: 'ระยอง', district: 'เมืองระยอง', subDistrict: 'ท่าประดู่', unitNumber: 1, latitude: 12.6807, longitude: 101.2574, voterCount: 478, reportsCount: 0, severityScore: 0 },
  { id: '18', province: 'นครสวรรค์', district: 'เมืองนครสวรรค์', subDistrict: 'ปากน้ำโพ', unitNumber: 1, latitude: 15.6966, longitude: 100.1158, voterCount: 412, reportsCount: 0, severityScore: 0 },
  { id: '19', province: 'พิษณุโลก', district: 'เมืองพิษณุโลก', subDistrict: 'ในเมือง', unitNumber: 1, latitude: 16.8293, longitude: 100.2720, voterCount: 389, reportsCount: 1, severityScore: 25 },
  { id: '20', province: 'อยุธยา', district: 'พระนครศรีอยุธยา', subDistrict: 'ประตูชัย', unitNumber: 1, latitude: 14.3559, longitude: 100.5670, voterCount: 356, reportsCount: 0, severityScore: 0 },
  
  // ภาคใต้
  { id: '21', province: 'ภูเก็ต', district: 'เมืองภูเก็ต', subDistrict: 'ตลาดใหญ่', unitNumber: 1, latitude: 7.8804, longitude: 98.3923, voterCount: 445, reportsCount: 1, severityScore: 25 },
  { id: '22', province: 'ภูเก็ต', district: 'เมืองภูเก็ต', subDistrict: 'ตลาดใหญ่', unitNumber: 2, latitude: 7.8820, longitude: 98.3950, voterCount: 412, reportsCount: 0, severityScore: 0 },
  { id: '23', province: 'สุราษฎร์ธานี', district: 'เมืองสุราษฎร์ธานี', subDistrict: 'มะขามเตี้ย', unitNumber: 1, latitude: 9.1347, longitude: 99.3331, voterCount: 389, reportsCount: 0, severityScore: 0 },
  { id: '24', province: 'หาดใหญ่', district: 'หาดใหญ่', subDistrict: 'หาดใหญ่ใน', unitNumber: 1, latitude: 7.0086, longitude: 100.4747, voterCount: 567, reportsCount: 2, severityScore: 75 },
  { id: '25', province: 'นครศรีธรรมราช', district: 'เมืองนครศรีธรรมราช', subDistrict: 'ในเมือง', unitNumber: 1, latitude: 8.4304, longitude: 99.9631, voterCount: 423, reportsCount: 0, severityScore: 0 },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'r1',
    unitId: '1',
    description: 'เครื่องลงคะแนนเสีย ไม่สามารถใช้งานได้ ผู้มีสิทธิต้องรอนานกว่า 1 ชั่วโมง',
    severity: 'high',
    mediaUrls: ['https://via.placeholder.com/400x300/ef4444/ffffff?text=Machine+Error'],
    mediaTypes: ['image'],
    reportedAt: '2026-02-08T09:30:00Z',
    incidentTime: '2026-02-08T08:15:00Z',
    aiCategory: 'เครื่องลงคะแนนเสีย',
    aiSummary: 'เครื่องลงคะแนนมีปัญหา ทำให้เกิดความล่าช้า',
    status: 'verified',
  },
  {
    id: 'r2',
    unitId: '1',
    description: 'บัตรเลือกตั้งไม่เพียงพอ ต้องรอบัตรเพิ่มจากหน่วยงาน',
    severity: 'medium',
    mediaUrls: ['https://via.placeholder.com/400x300/f59e0b/ffffff?text=Not+Enough+Ballots'],
    mediaTypes: ['image'],
    reportedAt: '2026-02-08T10:15:00Z',
    incidentTime: '2026-02-08T09:00:00Z',
    aiCategory: 'บัตรไม่เพียงพอ',
    aiSummary: 'บัตรเลือกตั้งหมดก่อนเวลา',
    status: 'pending',
  },
  {
    id: 'r3',
    unitId: '5',
    description: 'พบการขัดขวางผู้มีสิทธิเลือกตั้ง มีการเรียกร้องให้แสดงเอกสารเพิ่มเติมที่ไม่จำเป็น',
    severity: 'critical',
    mediaUrls: [
      'https://via.placeholder.com/400x300/dc2626/ffffff?text=Voter+Intimidation',
      'https://via.placeholder.com/400x300/dc2626/ffffff?text=Evidence+2'
    ],
    mediaTypes: ['image', 'image'],
    reportedAt: '2026-02-08T11:00:00Z',
    incidentTime: '2026-02-08T10:30:00Z',
    aiCategory: 'การขัดขวางผู้มีสิทธิ',
    aiSummary: 'มีการกีดกันผู้มีสิทธิเลือกตั้ง',
    status: 'verified',
  },
  {
    id: 'r4',
    unitId: '11',
    description: 'เจ้าหน้าที่ไม่พร้อม เปิดหน่วยล่าช้า 30 นาที',
    severity: 'medium',
    mediaUrls: [],
    mediaTypes: [],
    reportedAt: '2026-02-08T08:45:00Z',
    incidentTime: '2026-02-08T08:00:00Z',
    aiCategory: 'เปิดหน่วยล่าช้า',
    aiSummary: 'หน่วยเลือกตั้งเปิดล่าช้า',
    status: 'verified',
  },
  {
    id: 'r5',
    unitId: '24',
    description: 'น้ำท่วมหนัก ผู้มีสิทธิเดินทางมาลงคะแนนลำบาก',
    severity: 'high',
    mediaUrls: ['https://via.placeholder.com/400x300/3b82f6/ffffff?text=Flooding'],
    mediaTypes: ['image'],
    reportedAt: '2026-02-08T12:00:00Z',
    incidentTime: '2026-02-08T11:30:00Z',
    aiCategory: 'ภัยธรรมชาติ',
    aiSummary: 'น้ำท่วมส่งผลต่อการเลือกตั้ง',
    status: 'pending',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUnits: 95_000, // ประมาณการณ์หน่วยเลือกตั้งทั่วประเทศ
  totalReports: 127,
  criticalReports: 8,
  highReports: 23,
  mediumReports: 45,
  lowReports: 51,
  unitsWithIssues: 89,
};

// Mock API functions
export async function getElectionUnits(): Promise<ElectionUnit[]> {
  // จำลอง delay เหมือนเรียก API จริง
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockElectionUnits;
}

export async function getElectionUnitById(id: string): Promise<ElectionUnit | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockElectionUnits.find(u => u.id === id) || null;
}

export async function getReportsByUnitId(unitId: string): Promise<Report[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockReports.filter(r => r.unitId === unitId);
}

export async function getAllReports(): Promise<Report[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockReports;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockDashboardStats;
}

export async function createReport(reportData: any): Promise<Report> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newReport: Report = {
    id: `r${Date.now()}`,
    ...reportData,
    reportedAt: new Date().toISOString(),
    status: 'pending',
    aiCategory: reportData.aiCategory || 'อื่นๆ',
    aiSummary: reportData.aiSummary || reportData.description.slice(0, 100),
  };
  
  // เพิ่มเข้า mock data (แค่ใน memory)
  mockReports.push(newReport);
  
  return newReport;
}
