import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock aggregated data (simulating DB query from multiple doctors)
const diseaseHotspots = [
    { id: 1, lat: 12.9716, lng: 77.5946, city: 'Bangalore', disease: 'Viral Fever', cases: 120, color: 'red', radius: 1500 },
    { id: 2, lat: 12.9279, lng: 77.6271, city: 'Koramangala', disease: 'Dengue', cases: 45, color: 'orange', radius: 800 },
    { id: 3, lat: 12.9925, lng: 77.6737, city: 'Whitefield', disease: 'Flu', cases: 88, color: 'yellow', radius: 1000 },
    { id: 4, lat: 12.9141, lng: 77.6101, city: 'BTM Layout', disease: 'Gastroenteritis', cases: 30, color: 'blue', radius: 600 },
];

export default function DiseaseMap() {
    return (
        <div className="card p-0 overflow-hidden h-96 relative z-0">
            <MapContainer
                center={[12.9716, 77.5946]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {diseaseHotspots.map(hotspot => (
                    <React.Fragment key={hotspot.id}>
                        <Circle
                            center={[hotspot.lat, hotspot.lng]}
                            pathOptions={{ fillColor: hotspot.color, color: hotspot.color }}
                            radius={hotspot.radius}
                        />
                        <Marker position={[hotspot.lat, hotspot.lng]}>
                            <Popup>
                                <div className="text-sm">
                                    <h3 className="font-bold">{hotspot.city}</h3>
                                    <p className="m-0">Top Issue: <strong>{hotspot.disease}</strong></p>
                                    <p className="m-0 text-xs text-slate-500">{hotspot.cases} reported cases</p>
                                </div>
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>
        </div>
    );
}
