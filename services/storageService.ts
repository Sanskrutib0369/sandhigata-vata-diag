import { Patient } from '../types';

const STORAGE_KEY = 'sandhigata_vata_patients';

export const savePatient = (patient: Patient): void => {
  const existing = getPatients();
  const updated = [patient, ...existing.filter(p => p.id !== patient.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find(p => p.id === id);
};

export const deletePatient = (id: string): void => {
  const existing = getPatients();
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Delete multiple patients by ids (safe helper)
export const deletePatients = (ids: string[]): void => {
  if (!ids || ids.length === 0) return;
  const existing = getPatients();
  const idSet = new Set(ids);
  const updated = existing.filter(p => !idSet.has(p.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
