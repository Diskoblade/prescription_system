import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAnalyticsData } from '../../utils/storage';
import DiseaseMap from '../map/DiseaseMap';

export default function AnalyticsDashboard() {
    const [data] = useState(() => getAnalyticsData());

    return (
        <div className="container main-content" style={{ marginTop: '2rem' }}>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Analytics Dashboard</h2>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card bg-white p-6 shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Total Prescriptions</h3>
                    <p className="text-4xl font-bold text-cyan-700">{data.totalPrescriptions}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Disease Trends */}
                <div className="card p-6 h-96">
                    <h3 className="text-lg font-bold mb-4 text-slate-700">Top Diagnoses</h3>
                    {data.diseaseTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={data.diseaseTrends} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#0e7490" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
                    )}
                </div>

                {/* Medicine Usage */}
                <div className="card p-6 h-96">
                    <h3 className="text-lg font-bold mb-4 text-slate-700">Top Prescribed Medicines</h3>
                    {data.topMedicines.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={data.topMedicines} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={30}>
                                    {data.topMedicines.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0e7490', '#22d3ee', '#818cf8', '#f472b6', '#34d399'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
                    )}
                </div>
            </div>

            {/* Disease Map */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Regional Disease Hotspots</h3>
                <DiseaseMap />
            </div>
        </div>
    );
}
