export const savePrescription = (prescription) => {
    const existing = JSON.parse(localStorage.getItem('prescriptions') || '[]');

    // Create or update simplified patient index
    const patients = JSON.parse(localStorage.getItem('patients') || '{}');
    const patientId = prescription.patientData.name.toLowerCase().replace(/\s+/g, '_');

    patients[patientId] = {
        id: patientId,
        ...prescription.patientData,
        lastVisit: new Date().toISOString()
    };
    localStorage.setItem('patients', JSON.stringify(patients));

    const newPrescription = {
        ...prescription,
        id: Date.now(),
        patientId: patientId,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('prescriptions', JSON.stringify([...existing, newPrescription]));
    return newPrescription;
};

export const getAllPatients = () => {
    const patients = JSON.parse(localStorage.getItem('patients') || '{}');
    return Object.values(patients);
};

export const getPatientHistory = (patientId) => {
    const allPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    return allPrescriptions.filter(p => p.patientId === patientId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


export const getAnalyticsData = () => {
    const data = JSON.parse(localStorage.getItem('prescriptions') || '[]');

    // Aggregate diseases
    const diseaseCounts = {};
    data.forEach(p => {
        if (p.diagnosis) {
            diseaseCounts[p.diagnosis] = (diseaseCounts[p.diagnosis] || 0) + 1;
        }
    });

    // Aggregate medicines
    const medicineCounts = {};
    data.forEach(p => {
        if (p.medicines) {
            p.medicines.forEach(m => {
                if (m.name) {
                    medicineCounts[m.name] = (medicineCounts[m.name] || 0) + 1;
                }
            });
        }
    });

    return {
        totalPrescriptions: data.length,
        diseaseTrends: Object.entries(diseaseCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
        topMedicines: Object.entries(medicineCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    };
};
