'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { ElectionUnit } from '@/types';
import { getElectionUnits } from '@/lib/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers
let DefaultIcon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different severity levels
const getSeverityIcon = (severityScore: number) => {
  const color = severityScore >= 75 ? '#dc2626' :
                severityScore >= 50 ? '#f97316' :
                severityScore >= 25 ? '#eab308' : '#3b82f6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface ElectionMapProps {
  onUnitSelect?: (unit: ElectionUnit) => void;
  selectedUnitId?: string;
}

export default function ElectionMap({ onUnitSelect, selectedUnitId }: ElectionMapProps) {
  const [units, setUnits] = useState<ElectionUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const data = await getElectionUnits();
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-gray-500">กำลังโหลดแผนที่...</div>
      </div>
    );
  }

  // Center of Thailand
  const thailandCenter: [number, number] = [13.7563, 100.5018];

  return (
    <div className="relative">
      <MapContainer
        center={thailandCenter}
        zoom={6}
        style={{ height: '500px', width: '100%', borderRadius: '0.75rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {units.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.latitude, unit.longitude]}
            icon={getSeverityIcon(unit.severityScore)}
            eventHandlers={{
              click: () => onUnitSelect?.(unit),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-800">{unit.province}</h3>
                <p className="text-sm text-gray-600">
                  {unit.district} · หน่วย {unit.unitNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ผู้มีสิทธิ: {unit.voterCount.toLocaleString()} คน
                </p>
                {unit.reportsCount > 0 && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      unit.severityScore >= 75 ? 'bg-red-100 text-red-700' :
                      unit.severityScore >= 50 ? 'bg-orange-100 text-orange-700' :
                      unit.severityScore >= 25 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {unit.reportsCount} รายงาน
                    </span>
                  </div>
                )}
                <a
                  href={`/unit/${unit.id}`}
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  ดูรายละเอียด →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-bold text-gray-700 mb-2">ระดับความรุนแรง</p>
        <div className="space-y-1">
          {[
            { color: '#dc2626', label: 'วิกฤต (75-100)' },
            { color: '#f97316', label: 'สูง (50-74)' },
            { color: '#eab308', label: 'ปานกลาง (25-49)' },
            { color: '#3b82f6', label: 'ต่ำ (0-24)' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white shadow"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
