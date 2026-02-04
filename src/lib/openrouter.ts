import { ClassifiedReport, SeverityLevel } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Free models from OpenRouter
const FREE_MODELS = {
  trinity: 'arcee-ai/trinity-large-preview', // 131K context, good for agentic tasks
  deepseek: 'tngtech/deepseek-tng-r1t2-chimera', // 164K context, good reasoning
  glm: 'z-ai/glm-4.5-air', // 131K context, lightweight
  stepfun: 'stepfun/step-3.5-flash', // 256K context, speed efficient
};

// Default to Trinity for classification
const DEFAULT_MODEL = FREE_MODELS.trinity;

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | OpenRouterContent[];
}

interface OpenRouterContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  model: string = DEFAULT_MODEL
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured, using mock response');
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'korkornor',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter call failed:', error);
    throw error;
  }
}

export async function classifyReportWithOpenRouter(
  description: string,
  imageUrls: string[] = [],
  existingReports: { id: string; description: string; category: string }[] = []
): Promise<ClassifiedReport> {
  try {
    // Build message content
    const content: OpenRouterContent[] = [
      {
        type: 'text',
        text: `คุณเป็น AI ที่ช่วยวิเคราะห์และจัดหมวดหมู่รายงานความผิดปกติในการเลือกตั้ง/ประชามติของประเทศไทย

กรุณาวิเคราะห์รายงานต่อไปนี้และตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
{
  "category": "หมวดหมู่ของปัญหา (เช่น บัตรเสียหาย, เจ้าหน้าที่กระทำผิด, ความล่าช้า, การขัดขวางผู้มีสิทธิ์, อื่นๆ)",
  "severity": "ระดับความรุนแรง: low | medium | high | critical",
  "summary": "สรุปเหตุการณ์สั้นๆ ไม่เกิน 100 ตัวอักษร",
  "confidence": "ความมั่นใจในการวิเคราะห์ (0-1)",
  "possibleDuplicate": "true/false - มีโอกาสเป็นรายงานซ้ำหรือไม่",
  "detectedLocation": "จังหวัด/เขต/หน่วยที่ตรวจพบจากข้อความหรือรูปภาพ (ถ้ามี)"
}

เกณฑ์ระดับความรุนแรง:
- critical: ทุจริตเลือกตั้งร้ายแรง (เช่น นับคะแนนผิด, บัตรหายเป็นจำนวนมาก, การคุกคามผู้มีสิทธิ์)
- high: ปัญหาร้ายแรงที่อาจส่งผลต่อผลการเลือกตั้ง (เช่น เครื่องลงคะแนนเสีย, รอนานเกิน 2 ชั่วโมง)
- medium: ปัญหาที่มีผลกระทบปานกลาง (เช่น ความล่าช้า, บัตรขาด, เจ้าหน้าที่ไม่พร้อม)
- low: ปัญหาเล็กน้อย (เช่น ความไม่สะดวกเล็กน้อย, คำถามทั่วไป)

รายงาน: "${description}"

${existingReports.length > 0 ? `
รายงานที่มีอยู่แล้วในหน่วยนี้ (ใช้เปรียบเทียบว่าอาจเป็นรายงานซ้ำหรือไม่):
${existingReports.map(r => `- [${r.category}] ${r.description}`).join('\n')}
` : ''}

ตอบกลับเฉพาะ JSON เท่านั้น ไม่ต้องมีข้อความอื่น:`
      }
    ];

    // Add images if provided
    for (const imageUrl of imageUrls.slice(0, 3)) { // Max 3 images
      content.push({
        type: 'image_url',
        image_url: { url: imageUrl }
      });
    }

    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: content
      }
    ];

    const responseText = await callOpenRouter(messages, FREE_MODELS.trinity);
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from OpenRouter');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      category: parsed.category || 'อื่นๆ',
      severity: parsed.severity as SeverityLevel,
      summary: parsed.summary || description.slice(0, 100),
      confidence: parsed.confidence || 0.7,
      possibleDuplicate: parsed.possibleDuplicate || false,
    };
  } catch (error) {
    console.error('OpenRouter classification error:', error);
    // Fallback to default
    return {
      category: 'อื่นๆ',
      severity: 'medium',
      summary: description.slice(0, 100),
      confidence: 0.5,
      possibleDuplicate: false,
    };
  }
}

export async function extractLocationFromImage(imageUrl: string): Promise<{
  province?: string;
  district?: string;
  unitNumber?: string;
  confidence: number;
}> {
  try {
    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `นี่คือรูปภาพป้ายหน่วยเลือกตั้งหรือสถานที่เลือกตั้งในประเทศไทย
กรุณาวิเคราะห์และตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
{
  "province": "ชื่อจังหวัด (ถ้าพบ)",
  "district": "ชื่อเขต/อำเภอ (ถ้าพบ)",
  "unitNumber": "หมายเลขหน่วยเลือกตั้ง (ถ้าพบ)",
  "confidence": "ความมั่นใจ 0-1"
}

ตอบกลับเฉพาะ JSON เท่านั้น:`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ];

    const responseText = await callOpenRouter(messages, FREE_MODELS.glm); // Use GLM for vision
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      province: parsed.province,
      district: parsed.district,
      unitNumber: parsed.unitNumber,
      confidence: parsed.confidence || 0.5,
    };
  } catch (error) {
    console.error('Location extraction error:', error);
    return { confidence: 0 };
  }
}

export async function findSimilarReportsWithOpenRouter(
  description: string,
  candidates: { id: string; description: string; location: string }[]
): Promise<string[]> {
  if (candidates.length === 0) return [];

  try {
    const prompt = `คุณเป็น AI ที่ช่วยเปรียบเทียบรายงานว่าเป็นรายงานเดียวกันหรือไม่

รายงานใหม่:
"${description}"

รายงานที่อาจคล้ายกัน:
${candidates.map((c, i) => `[${i + 1}] ID: ${c.id} - สถานที่: ${c.location} - ${c.description}`).join('\n')}

กรุณาตอบเป็น JSON:
{
  "similarIds": ["id ของรายงานที่น่าจะซ้ำกัน (ถ้ามี)"],
  "reason": "เหตุผลสั้นๆ"
}

ตอบกลับเฉพาะ JSON:`;

    const messages: OpenRouterMessage[] = [
      { role: 'user', content: [{ type: 'text', text: prompt }] }
    ];

    const responseText = await callOpenRouter(messages, FREE_MODELS.deepseek);
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.similarIds || [];
  } catch (error) {
    console.error('Similarity check error:', error);
    return [];
  }
}

// Mock mode for build time
export function isOpenRouterConfigured(): boolean {
  return !!OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 0;
}
