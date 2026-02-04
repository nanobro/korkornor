import { NextRequest, NextResponse } from 'next/server';
import { classifyReportWithOpenRouter, isOpenRouterConfigured } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { description, imageUrls, existingReports } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Check if OpenRouter is configured
    if (!isOpenRouterConfigured()) {
      // Mock response for demo
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      const categories = [
        'เครื่องลงคะแนนเสีย',
        'บัตรไม่เพียงพอ',
        'การขัดขวางผู้มีสิทธิ',
        'เปิดหน่วยล่าช้า',
        'ภัยธรรมชาติ',
        'อื่นๆ'
      ];

      // Simple keyword matching
      let severity: typeof severities[number] = 'medium';
      if (description.includes('ขัดขวาง') || description.includes('คุกคาม')) {
        severity = 'critical';
      } else if (description.includes('เครื่องเสีย') || description.includes('ไม่ทำงาน')) {
        severity = 'high';
      } else if (description.includes('ล่าช้า') || description.includes('รอนาน')) {
        severity = 'medium';
      }

      return NextResponse.json({
        classification: {
          category: categories[Math.floor(Math.random() * categories.length)],
          severity,
          summary: description.slice(0, 100),
          confidence: 0.75,
          possibleDuplicate: false,
        },
        mockMode: true,
        message: 'AI จำลอง (Mock) - ไม่ได้เชื่อมต่อ OpenRouter'
      });
    }

    // Use OpenRouter for classification
    const result = await classifyReportWithOpenRouter(
      description,
      imageUrls || [],
      existingReports || []
    );

    return NextResponse.json({
      classification: result,
      model: 'arcee-ai/trinity-large-preview (OpenRouter)',
    });
  } catch (error) {
    console.error('Error classifying report:', error);
    return NextResponse.json(
      { error: 'Failed to classify report' },
      { status: 500 }
    );
  }
}
