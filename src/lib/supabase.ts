import { ElectionUnit, Report, DashboardStats } from '@/types';
import { 
  getElectionUnits as mockGetElectionUnits,
  getElectionUnitById as mockGetElectionUnitById,
  getReportsByUnitId as mockGetReportsByUnitId,
  getAllReports as mockGetAllReports,
  getDashboardStats as mockGetDashboardStats,
  createReport as mockCreateReport,
} from './mockData';
import { IS_MOCK_MODE } from './mockMode';

// ============================================
// MOCK MODE - ใช้ข้อมูลจำลอง (ไม่ต้องตั้งค่า Supabase)
// ============================================

export async function getElectionUnits(): Promise<ElectionUnit[]> {
  return mockGetElectionUnits();
}

export async function getElectionUnitById(id: string): Promise<ElectionUnit | null> {
  return mockGetElectionUnitById(id);
}

export async function getReportsByUnitId(unitId: string): Promise<Report[]> {
  return mockGetReportsByUnitId(unitId);
}

export async function getAllReports(): Promise<Report[]> {
  return mockGetAllReports();
}

export async function createReport(report: Omit<Report, 'id'>): Promise<Report> {
  return mockCreateReport(report);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return mockGetDashboardStats();
}

// ============================================
// เมื่อต้องการใช้งานจริง ให้แก้ไขด้านล่างนี้
// ============================================
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function getElectionUnits(): Promise<ElectionUnit[]> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('election_units').select('*');
  if (error) throw error;
  return data || [];
}

export async function getElectionUnitById(id: string): Promise<ElectionUnit | null> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('election_units').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function getReportsByUnitId(unitId: string): Promise<Report[]> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').select('*').eq('unit_id', unitId);
  if (error) throw error;
  return data || [];
}

export async function getAllReports(): Promise<Report[]> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').select('*');
  if (error) throw error;
  return data || [];
}

export async function createReport(report: Omit<Report, 'id'>): Promise<Report> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').insert([{
    unit_id: report.unitId,
    description: report.description,
    severity: report.severity,
    media_urls: report.mediaUrls,
    media_types: report.mediaTypes,
    reported_at: report.reportedAt,
    incident_time: report.incidentTime,
    ai_category: report.aiCategory,
    ai_summary: report.aiSummary,
    duplicate_of: report.duplicateOf,
    status: report.status,
  }]).select().single();
  
  if (error) throw error;
  return data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data: units, error: unitsError } = await supabase.from('election_units').select('id');
  if (unitsError) throw unitsError;

  const { data: reports, error: reportsError } = await supabase.from('reports').select('severity, unit_id');
  if (reportsError) throw reportsError;

  const criticalReports = reports.filter((r: any) => r.severity === 'critical').length;
  const highReports = reports.filter((r: any) => r.severity === 'high').length;
  const mediumReports = reports.filter((r: any) => r.severity === 'medium').length;
  const lowReports = reports.filter((r: any) => r.severity === 'low').length;
  const uniqueUnitIds = new Set(reports.map((r: any) => r.unit_id));

  return {
    totalUnits: units.length,
    totalReports: reports.length,
    criticalReports,
    highReports,
    mediumReports,
    lowReports,
    unitsWithIssues: uniqueUnitIds.size,
  };
}
*/
