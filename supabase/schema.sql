-- Election Units Table
CREATE TABLE IF NOT EXISTS election_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  sub_district TEXT NOT NULL,
  unit_number INTEGER NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  voter_count INTEGER DEFAULT 0,
  reports_count INTEGER DEFAULT 0,
  severity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES election_units(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  media_urls TEXT[] DEFAULT '{}',
  media_types TEXT[] DEFAULT '{}',
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  incident_time TIMESTAMP WITH TIME ZONE,
  ai_category TEXT,
  ai_summary TEXT,
  duplicate_of UUID REFERENCES reports(id),
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_election_units_province ON election_units(province);
CREATE INDEX IF NOT EXISTS idx_election_units_location ON election_units(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_unit_id ON reports(unit_id);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_at ON reports(reported_at);

-- Function to update reports_count and severity_score
CREATE OR REPLACE FUNCTION update_unit_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE election_units
    SET 
      reports_count = reports_count + 1,
      severity_score = GREATEST(severity_score, 
        CASE NEW.severity
          WHEN 'critical' THEN 100
          WHEN 'high' THEN 75
          WHEN 'medium' THEN 50
          ELSE 25
        END
      ),
      updated_at = NOW()
    WHERE id = NEW.unit_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE election_units
    SET 
      reports_count = GREATEST(0, reports_count - 1),
      updated_at = NOW()
    WHERE id = OLD.unit_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_unit_stats_insert ON reports;
CREATE TRIGGER trigger_update_unit_stats_insert
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_unit_stats();

DROP TRIGGER IF EXISTS trigger_update_unit_stats_delete ON reports;
CREATE TRIGGER trigger_update_unit_stats_delete
  AFTER DELETE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_unit_stats();

-- Row Level Security Policies
ALTER TABLE election_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow read access to all
CREATE POLICY "Allow read election_units" ON election_units
  FOR SELECT USING (true);

CREATE POLICY "Allow read reports" ON reports
  FOR SELECT USING (true);

-- Allow insert for reports
CREATE POLICY "Allow insert reports" ON reports
  FOR INSERT WITH CHECK (true);

-- Sample data for testing
INSERT INTO election_units (province, district, sub_district, unit_number, latitude, longitude, voter_count)
VALUES 
  ('กรุงเทพมหานคร', 'เขตพญาไท', 'สามเสนใน', 1, 13.7563, 100.5018, 523),
  ('กรุงเทพมหานคร', 'เขตพญาไท', 'สามเสนใน', 2, 13.7580, 100.5030, 498),
  ('กรุงเทพมหานคร', 'เขตราชเทวี', 'ถนนพญาไท', 1, 13.7540, 100.5220, 612),
  ('กรุงเทพมหานคร', 'เขตราชเทวี', 'ถนนพญาไท', 2, 13.7550, 100.5240, 587),
  ('เชียงใหม่', 'เมืองเชียงใหม่', 'ศรีภูมิ', 1, 18.7883, 98.9853, 445),
  ('เชียงใหม่', 'เมืองเชียงใหม่', 'ศรีภูมิ', 2, 18.7890, 98.9870, 412),
  ('ขอนแก่น', 'เมืองขอนแก่น', 'ในเมือง', 1, 16.4322, 102.8236, 389),
  ('ขอนแก่น', 'เมืองขอนแก่น', 'ในเมือง', 2, 16.4330, 102.8250, 356),
  ('ชลบุรี', 'เมืองชลบุรี', 'บางปลาสร้อย', 1, 13.3611, 100.9847, 478),
  ('ภูเก็ต', 'เมืองภูเก็ต', 'ตลาดใหญ่', 1, 7.8804, 98.3923, 312)
ON CONFLICT DO NOTHING;
