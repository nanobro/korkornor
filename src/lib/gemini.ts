import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClassifiedReport, SeverityLevel } from '@/types';

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const SEVERITY_PROMPT = `
คุณเป็น AI ที่ช่วยวิเคราะห์และจัดหมวดหมู่รายงานความผิดปกติในการเลือกตั้ง/ประชามติของประเทศไทย

กรุณาวิเคราะห์รายงานต่อไปนี้และตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
{
  "category": "หมวดหมู่ของปัญหา (เช่น บัตรเสียหาย, เจ้าหน้าที่กระทำผิด, ความล่าช้า, การขัดขวางผู้มีสิทธิ์, อื่นๆ)",
  "severity": "ระดับความรุนแรง: low | medium | high | critical",
  "summary": "สรุปเหตุการณ์สั้นๆ ไม่เกิน 100 ตัวอักษร",
  "confidence": "ความมั่นใจในการวิเคราะห์ (0-1)",
  "possibleDuplicate": "true/false - มีโอกาสเป็นรายงานซ้ำหรือไม่",
  "keywords": ["คำสำคัญสำหรับใช้เปรียบเทียบกับรายงานอื่น"]
}

เกณฑ์ระดับความรุนแรง:
- critical: ทุจริตเลือกตั้งร้ายแรง (เช่น นับคะแนนผิด, บัตรหายเป็นจำนวนมาก, การคุกคามผู้มีสิทธิ์)
- high: ปัญหาร้ายแรงที่อาจส่งผลต่อผลการเลือกตั้ง (เช่น เครื่องลงคะแนนเสีย, รอนานเกิน 2 ชั่วโมง)
- medium: ปัญหาที่มีผลกระทบปานกลาง (เช่น ความล่าช้า, บัตรขาด, เจ้าหน้าที่ไม่พร้อม)
- low: ปัญหาเล็กน้อย (เช่น ความไม่สะดวกเล็กน้อย, คำถามทั่วไป)

รายงาน:
`;

export async function classifyReport(
  description: string,
  existingReports: { id: string; description: string; category: string }[] = []
): Promise<ClassifiedReport> {
  if (!genAI) {
    // Return default classification when API key is not available
    return {
      category: 'อื่นๆ',
      severity: 'medium',
      summary: description.slice(0, 100),
      confidence: 0.5,
      possibleDuplicate: false,
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  let prompt = SEVERITY_PROMPT + description;

  if (existingReports.length > 0) {
    prompt += `

รายงานที่มีอยู่แล้วในหน่วยนี้ (ใช้เปรียบเทียบว่าอาจเป็นรายงานซ้ำหรือไม่):
${existingReports.map(r => `- [${r.category}] ${r.description}`).join('\n')}
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      category: parsed.category,
      severity: parsed.severity as SeverityLevel,
      summary: parsed.summary,
      confidence: parsed.confidence,
      possibleDuplicate: parsed.possibleDuplicate,
    };
  } catch (error) {
    console.error('AI classification error:', error);
    // Return default classification
    return {
      category: 'อื่นๆ',
      severity: 'medium',
      summary: description.slice(0, 100),
      confidence: 0.5,
      possibleDuplicate: false,
    };
  }
}

export async function findSimilarReports(
  description: string,
  mediaUrls: string[],
  candidates: { id: string; description: string; mediaUrls: string[] }[]
): Promise<string[]> {
  if (candidates.length === 0 || !genAI) return [];

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const prompt = `
คุณเป็น AI ที่ช่วยเปรียบเทียบรายงานว่าเป็นรายงานเดียวกันหรือไม่

รายงานใหม่:
${description}

รายงานที่อาจคล้ายกัน:
${candidates.map((c, i) => `[${i + 1}] ID: ${c.id} - ${c.description}`).join('\n')}

กรุณาตอบเป็น JSON:
{
  "similarIds": ["id ของรายงานที่น่าจะซ้ำกัน"],
  "reason": "เหตุผลสั้นๆ"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.similarIds || [];
  } catch (error) {
    console.error('Similarity check error:', error);
    return [];
  }
}
