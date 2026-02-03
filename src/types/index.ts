export interface ElectionUnit {
  id: string;
  province: string;
  district: string;
  subDistrict: string;
  unitNumber: number;
  latitude: number;
  longitude: number;
  voterCount: number;
  reportsCount: number;
  severityScore: number;
}

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  unitId: string;
  description: string;
  severity: SeverityLevel;
  mediaUrls: string[];
  mediaTypes: ('image' | 'video')[];
  reportedAt: string;
  incidentTime?: string;
  aiCategory?: string;
  aiSummary?: string;
  duplicateOf?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ReportSubmission {
  unitId: string;
  description: string;
  severity: SeverityLevel;
  incidentTime?: string;
  files: File[];
}

export interface ClassifiedReport {
  category: string;
  severity: SeverityLevel;
  summary: string;
  confidence: number;
  possibleDuplicate: boolean;
  similarReportIds?: string[];
}

export interface DashboardStats {
  totalUnits: number;
  totalReports: number;
  criticalReports: number;
  highReports: number;
  mediumReports: number;
  lowReports: number;
  unitsWithIssues: number;
}
