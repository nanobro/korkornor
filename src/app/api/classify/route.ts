import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Mock AI Classification
    const categories = [
      'เครื่องลงคะแนนเสีย',
      'บัตรไม่เพียงพอ',
      'การขัดขวางผู้มีสิทธิ',
      'เปิดหน่วยล่าช้า',
      'ภัยธรรมชาติ',
      'อื่นๆ'
    ];
    
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    
    // Simple keyword matching for demo
    let severity: typeof severities[number] = 'medium';
    if (description.includes('ขัดขวาง') || description.includes('คุกคาม')) {
      severity = 'critical';
    } else if (description.includes('เครื่องเสีย') || description.includes('ไม่ทำงาน')) {
      severity = 'high';
    } else if (description.includes('ล่าช้า') || description.includes('รอนาน')) {
      severity = 'medium';
    } else if (description.includes('เล็กน้อย') || description.includes('น้อย')) {
      severity = 'low';
    }

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return NextResponse.json({ 
      classification: {
        category: randomCategory,
        severity,
        summary: description.slice(0, 100),
        confidence: 0.75 + Math.random() * 0.2,
        possibleDuplicate: false,
      },
      mockMode: true,
      message: 'AI จำลอง (Mock) - ไม่ได้เชื่อมต่อ Gemini จริง'
    });
  } catch (error) {
    console.error('Error classifying report:', error);
    return NextResponse.json(
      { error: 'Failed to classify report' },
      { status: 500 }
    );
  }
}
