/**
 * Script to import election units from CSV or JSON
 * Usage: node scripts/import-election-units.js <file-path>
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set environment variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importFromJSON(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  console.log(`📊 Found ${data.length} units to import`);
  
  const batchSize = 100;
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('election_units')
      .upsert(batch, { onConflict: ['province', 'district', 'sub_district', 'unit_number'] });
    
    if (error) {
      console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error);
      failed += batch.length;
    } else {
      imported += batch.length;
      console.log(`✅ Imported ${imported}/${data.length} units`);
    }
  }
  
  console.log(`\n🎉 Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

async function importFromCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });
    
    // Convert data types
    data.push({
      province: row.province || row.จังหวัด,
      district: row.district || row.อำเภอ,
      sub_district: row.sub_district || row.ตำบล,
      unit_number: parseInt(row.unit_number || row.หน่วยที่),
      latitude: parseFloat(row.latitude || row.ละติจูด),
      longitude: parseFloat(row.longitude || row.ลองจิจูด),
      voter_count: parseInt(row.voter_count || row.จำนวนผู้มีสิทธิ || 0),
    });
  }
  
  await importFromJSONData(data);
}

async function importFromJSONData(data) {
  console.log(`📊 Found ${data.length} units to import`);
  
  const batchSize = 100;
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('election_units')
      .upsert(batch, { onConflict: ['province', 'district', 'sub_district', 'unit_number'] });
    
    if (error) {
      console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error);
      failed += batch.length;
    } else {
      imported += batch.length;
      console.log(`✅ Imported ${imported}/${data.length} units`);
    }
  }
  
  console.log(`\n🎉 Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

// Main
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/import-election-units.js <file-path>');
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();
if (ext === '.json') {
  importFromJSON(filePath);
} else if (ext === '.csv') {
  importFromCSV(filePath);
} else {
  console.error('❌ Unsupported file format. Use .json or .csv');
  process.exit(1);
}
