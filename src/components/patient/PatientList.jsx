import React, { useState, useMemo } from 'react';
import { Search, User, FileText } from 'lucide-react';
import { getAllPatients, getPatientHistory } from '../../utils/storage';

export default function PatientList() {
    const [patients] = useState(() => getAllPatients());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Derived state for history using useMemo since getPatientHistory is synchronous
    const history = useMemo(() => {
        if (selectedPatient) {
            return getPatientHistory(selectedPatient.id);
        }
        return [];
    }, [selectedPatient]);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container main-content mt-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Patient Database</h2>

            <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* List */}
                <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="input-field pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredPatients.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No patients found</div>
                        ) : (
                            filteredPatients.map(patient => (
                                <div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedPatient?.id === patient.id ? 'bg-cyan-50 border-cyan-100' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800">{patient.name}</h4>
                                            <p className="text-xs text-slate-500">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 p-6 h-full overflow-y-auto">
                    {selectedPatient ? (
                        <div>
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                    <span className="text-2xl font-bold">{selectedPatient.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                                    <p className="text-slate-500 text-sm">
                                        {selectedPatient.age} Y • {selectedPatient.gender}
                                    </p>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
                                <FileText size={20} /> Prescription History
                            </h3>

                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <p className="text-slate-400">No history available.</p>
                                ) : (
                                    history.map(record => (
                                        <div key={record.id} className="border border-slate-200 rounded-lg p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-cyan-700">Diagnosis: {record.diagnosis}</span>
                                                <span className="text-xs text-slate-500">{new Date(record.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="space-y-1">
                                                {record.medicines.map((m, idx) => (
                                                    <div key={idx} className="text-sm text-slate-600">
                                                        • {m.name} ({m.dosage}) - {m.frequency}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <User size={48} className="mb-4 opacity-50" />
                            <p>Select a patient to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
