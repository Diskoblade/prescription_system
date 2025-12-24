import React from 'react';
import { Plus, Trash2, Pill } from 'lucide-react';
import { medicines as medicineOptions, frequencies, durations, instructions, diseases } from '../../utils/mockData';
import MedicineSearch from './MedicineSearch';

export default function PrescriptionForm({
    diagnosis,
    setDiagnosis,
    medicines,
    setMedicines
}) {

    const addMedicine = () => {
        setMedicines([
            ...medicines,
            {
                id: Date.now(),
                name: '',
                dosage: '',
                frequency: '1-0-1',
                duration: '5 days',
                instruction: 'After food'
            }
        ]);
    };

    const removeMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    const updateMedicine = (id, field, value) => {
        setMedicines(medicines.map(m => {
            if (m.id === id) {
                const updated = { ...m, [field]: value };
                // Auto-fill default dosage if medicine changes
                if (field === 'name') {
                    const selectedMed = medicineOptions.find(opt => opt.name === value);
                    if (selectedMed) {
                        updated.dosage = selectedMed.defaultDosage;
                        updated.type = selectedMed.type;
                    }
                }
                return updated;
            }
            return m;
        }));
    };

    return (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Diagnosis & Medications
                </h3>

                <div>
                    <label className="label" htmlFor="diagnosis">Diagnosis</label>
                    <select
                        id="diagnosis"
                        className="input-field"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                    >
                        <option value="">Select Diagnosis</option>
                        {diseases.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {medicines.map((med, index) => (
                    <div key={med.id} style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-bg)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        position: 'relative'
                    }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                Medicine #{index + 1}
                            </h4>
                            {medicines.length > 1 && (
                                <button
                                    onClick={() => removeMedicine(med.id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Drug Name</label>
                                <MedicineSearch
                                    value={med.name}
                                    onChange={(val) => updateMedicine(med.id, 'name', val)}
                                    onSelect={(selected) => {
                                        updateMedicine(med.id, 'name', selected.name);
                                        if (selected.strengths && selected.strengths.length > 0) {
                                            updateMedicine(med.id, 'dosage', selected.strengths[0]);
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="label">Dosage</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={med.dosage}
                                    onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                                    placeholder="e.g. 500mg"
                                />
                            </div>

                            <div>
                                <label className="label">Frequency</label>
                                <select
                                    className="input-field"
                                    value={med.frequency}
                                    onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                                >
                                    {frequencies.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Duration</label>
                                <select
                                    className="input-field"
                                    value={med.duration}
                                    onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                                >
                                    {durations.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Instructions</label>
                                <select
                                    className="input-field"
                                    value={med.instruction}
                                    onChange={(e) => updateMedicine(med.id, 'instruction', e.target.value)}
                                >
                                    {instructions.map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <button className="btn btn-secondary w-full" onClick={addMedicine} style={{ borderStyle: 'dashed' }}>
                    <Plus size={18} /> Add Medicine
                </button>
            </div>
        </div>
    );
}
