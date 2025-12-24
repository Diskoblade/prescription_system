import React from 'react';

export default function PatientDetailsForm({ data, onChange }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    return (
        <div className="card mb-6" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Patient Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                    <label className="label" htmlFor="patientName">Patient Name</label>
                    <input
                        id="patientName"
                        name="name"
                        type="text"
                        className="input-field"
                        placeholder="e.g. John Doe"
                        value={data.name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="label" htmlFor="age">Age</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        className="input-field"
                        placeholder="e.g. 30"
                        value={data.age || ''}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="label" htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        className="input-field"
                        value={data.gender || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="label" htmlFor="date">Date</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        className="input-field"
                        value={data.date || new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}
