import { NextRequest, NextResponse } from 'next/server';
import { getReportsByUnitId, getAllReports, createReport } from '@/lib/supabase';
import { showMockNotification } from '@/lib/mockMode';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const unitId = searchParams.get('unitId');

  try {
    if (unitId) {
      const reports = await getReportsByUnitId(unitId);
      return NextResponse.json({ reports });
    } else {
      const reports = await getAllReports();
      return NextResponse.json({ reports });
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const unitId = formData.get('unitId') as string;
    const description = formData.get('description') as string;
    const severity = formData.get('severity') as any;
    const incidentTime = formData.get('incidentTime') as string | undefined;
    
    // Mock AI Classification
    const categories = [
      'เครื่องลงคะแนนเสีย',
      'บัตรไม่เพียงพอ',
      'การขัดขวางผู้มีสิทธิ',
      'เปิดหน่วยล่าช้า',
      'ภัยธรรมชาติ',
      'อื่นๆ'
    ];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const reportData = {
      unitId,
      description,
      severity,
      mediaUrls: ['https://via.placeholder.com/400x300/666/ffffff?text=Mock+Image'],
      mediaTypes: ['image'] as ('image' | 'video')[],
      reportedAt: new Date().toISOString(),
      incidentTime,
      aiCategory: randomCategory,
      aiSummary: description.slice(0, 80) + '...',
      status: 'pending' as const,
    };

    const createdReport = await createReport(reportData);

    return NextResponse.json({ 
      report: createdReport,
      aiAnalysis: {
        category: randomCategory,
        confidence: 0.85,
        possibleDuplicate: false,
      },
      mockMode: true,
      message: 'นี่เป็นระบบจำลอง (Mockup) - ข้อมูลจะไม่ถูกบันทึกจริง'
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
