import React from 'react';
import { Stethoscope, Printer } from 'lucide-react';

export default function PrescriptionPreview({ patientData, diagnosis, medicines, onPrint }) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="card" style={{ height: 'fit-content' }}>
            <div className="flex justify-between items-center mb-6 no-print">
                <h3 className="text-lg font-bold">Prescription Preview</h3>
                <button onClick={onPrint} className="btn btn-primary">
                    <Printer size={16} /> Print
                </button>
            </div>

            <div id="printable-area" style={{
                border: '1px solid #e2e8f0',
                padding: '2rem',
                backgroundColor: 'white',
                minHeight: '600px',
                position: 'relative'
            }}>
                {/* Header */}
                <div className="flex justify-between items-start" style={{ borderBottom: '2px solid #0e7490', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div className="flex items-center gap-2 text-cyan-700 mb-2">
                            <Stethoscope size={24} />
                            <span className="text-xl font-bold">MediScript Clinic</span>
                        </div>
                        <p className="text-sm text-slate-500">Dr. Rahul TP, MBBS, MD</p>
                        <p className="text-sm text-slate-500">Reg No: 12345678</p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                        <p>123 Health Avenue,</p>
                        <p>Wellness City, 560001</p>
                        <p>Ph: +91 98765 43210</p>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="bg-slate-50 p-4 rounded-md mb-6 text-sm">
                    <div className="grid grid-cols-2 gap-y-2">
                        <p><strong>Name:</strong> {patientData.name || '____________'}</p>
                        <p><strong>Date:</strong> {patientData.date || currentDate}</p>
                        <p><strong>Age/Gender:</strong> {patientData.age ? `${patientData.age} Y` : '__'} / {patientData.gender || '__'}</p>
                        <p><strong>Diagnosis:</strong> {diagnosis || '____________'}</p>
                    </div>
                </div>

                {/* Medicines */}
                <div className="mb-8">
                    <h4 className="font-bold text-cyan-700 mb-2">Rx (Medications)</h4>
                    <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th className="py-2">Medicine</th>
                                <th className="py-2">Dosage</th>
                                <th className="py-2">Frequency</th>
                                <th className="py-2">Duration</th>
                                <th className="py-2">Instruction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((med, idx) => (
                                <tr key={med.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td className="py-3 font-medium">{med.name} <span className="text-xs text-slate-400">({med.type})</span></td>
                                    <td className="py-3">{med.dosage}</td>
                                    <td className="py-3">{med.frequency}</td>
                                    <td className="py-3">{med.duration}</td>
                                    <td className="py-3 text-slate-500">{med.instruction}</td>
                                </tr>
                            ))}
                            {medicines.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-400 italic">No medicines added yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', textAlign: 'center' }}>
                    <div style={{ height: '50px' }}></div>
                    <p className="border-t border-slate-300 pt-2 font-bold text-slate-600">Signature</p>
                </div>
            </div>
        </div>
    );
}
