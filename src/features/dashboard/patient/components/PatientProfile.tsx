"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/authProvider";
import { Gender, BloodGroup, Patient } from "@/types";
import { DatePicker } from "@/components/ui/date-picker";
import { FileText, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function PatientProfile() {
  const { currentProfile, updatePatientProfile, uploadMedicalReport, deleteMedicalReport } = useAuth();
  const p = currentProfile as Patient | null;

  // Form states
  const [patName, setPatName] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patAddress, setPatAddress] = useState("");
  const [patGender, setPatGender] = useState<Gender>(Gender.MALE);
  const [patBlood, setPatBlood] = useState<BloodGroup>(BloodGroup.O_POSITIVE);
  const [patDob, setPatDob] = useState("");
  const [patHeight, setPatHeight] = useState("");
  const [patWeight, setPatWeight] = useState("");
  const [patAllergies, setPatAllergies] = useState(false);
  const [patDiabetes, setPatDiabetes] = useState(false);
  const [patSmoking, setPatSmoking] = useState(false);
  const [patDiet, setPatDiet] = useState("");
  const [patHistory, setPatHistory] = useState("");
  const [patMarital, setPatMarital] = useState("");
  const [reportFileName, setReportFileName] = useState("");

  useEffect(() => {
    if (p) {
      setPatName(p.name || "");
      setPatPhone(p.contactNumber || "");
      setPatAddress(p.address || "");
      if (p.patientHealthData) {
        setPatGender(p.patientHealthData.gender);
        setPatBlood(p.patientHealthData.bloodGroup);
        setPatDob(
          p.patientHealthData.dateOfBirth
            ? p.patientHealthData.dateOfBirth.split("T")[0]
            : ""
        );
        setPatHeight(p.patientHealthData.height || "");
        setPatWeight(p.patientHealthData.weight || "");
        setPatAllergies(p.patientHealthData.hasAllergies);
        setPatDiabetes(p.patientHealthData.hasDiabetes);
        setPatSmoking(p.patientHealthData.smokingStatus);
        setPatDiet(p.patientHealthData.dietaryPreferences || "");
        setPatHistory(p.patientHealthData.mentalHealthHistory || "");
        setPatMarital(p.patientHealthData.maritalStatus || "");
      }
    }
  }, [p]);

  if (!p) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile(
      { name: patName, contactNumber: patPhone, address: patAddress },
      {
        gender: patGender,
        dateOfBirth: patDob
          ? new Date(patDob).toISOString()
          : new Date().toISOString(),
        bloodGroup: patBlood,
        hasAllergies: patAllergies,
        hasDiabetes: patDiabetes,
        height: patHeight,
        weight: patWeight,
        smokingStatus: patSmoking,
        dietaryPreferences: patDiet,
        mentalHealthHistory: patHistory,
        maritalStatus: patMarital,
      }
    );
    toast.success("Health profile updated successfully.");
  };

  const handleReportUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFileName) return;
    uploadMedicalReport(reportFileName);
    setReportFileName("");
    toast.success("Medical report uploaded successfully.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      {/* Left Panel: Profile settings */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleProfileSave} className="space-y-6">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
            Personal & Medical Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={patName}
                onChange={(e) => setPatName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
              <input
                type="text"
                value={patPhone}
                onChange={(e) => setPatPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mailing Address</label>
            <input
              type="text"
              value={patAddress}
              onChange={(e) => setPatAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-primary"
            />
          </div>

          <hr className="border-slate-50 dark:border-slate-850" />
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Health Data Details</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Gender</label>
              <select
                value={patGender}
                onChange={(e) => setPatGender(e.target.value as Gender)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs appearance-none"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Blood Group</label>
              <select
                value={patBlood}
                onChange={(e) => setPatBlood(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
              >
                {Object.values(BloodGroup).map(bg => (
                  <option key={bg} value={bg}>{bg.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Date of Birth</label>
              <DatePicker
                value={patDob}
                onChange={setPatDob}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Marital Status</label>
              <select
                value={patMarital}
                onChange={(e) => setPatMarital(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Height (cm/ft)</label>
              <input
                type="text"
                value={patHeight}
                onChange={(e) => setPatHeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                placeholder="5 feet 9 inches"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Weight (kg)</label>
              <input
                type="text"
                value={patWeight}
                onChange={(e) => setPatWeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                placeholder="75 kg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs py-2 bg-slate-50/50 dark:bg-slate-850/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="patAllergies"
                checked={patAllergies}
                onChange={(e) => setPatAllergies(e.target.checked)}
                className="h-4 w-4 text-primary rounded-sm border-slate-350"
              />
              <label htmlFor="patAllergies" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Has Allergies</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="patDiabetes"
                checked={patDiabetes}
                onChange={(e) => setPatDiabetes(e.target.checked)}
                className="h-4 w-4 text-primary rounded-sm border-slate-350"
              />
              <label htmlFor="patDiabetes" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Has Diabetes</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="patSmoking"
                checked={patSmoking}
                onChange={(e) => setPatSmoking(e.target.checked)}
                className="h-4 w-4 text-primary rounded-sm border-slate-350"
              />
              <label htmlFor="patSmoking" className="font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Smoking Status</label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Dietary Preferences</label>
              <input
                type="text"
                value={patDiet}
                onChange={(e) => setPatDiet(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                placeholder="Vegetarian / None"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Mental Health notes</label>
              <input
                type="text"
                value={patHistory}
                onChange={(e) => setPatHistory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                placeholder="Anxiety / None"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all duration-200"
          >
            Save Health Profile
          </button>
        </form>
      </div>

      {/* Right Panel: Medical records uploader */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Medical Reports Vault</h3>
          <p className="text-[11px] text-slate-400 mt-1">Upload relevant blood profiles or radiology report PDFs (maximum 5 files).</p>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {p.medicalReports && p.medicalReports.length > 0 ? (
            p.medicalReports.map(rep => (
              <div key={rep.id} className="p-3 bg-slate-55 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="font-bold text-slate-700 dark:text-slate-350 truncate">{rep.reportName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMedicalReport(rep.id)}
                  className="p-1 hover:bg-red-55/20 text-red-500 rounded-lg cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-405 text-xs border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
              No files uploaded.
            </div>
          )}
        </div>

        {/* Uploader Form */}
        {(!p.medicalReports || p.medicalReports.length < 5) ? (
          <form onSubmit={handleReportUploadSubmit} className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850">
            <input
              type="text"
              required
              value={reportFileName}
              onChange={(e) => setReportFileName(e.target.value)}
              placeholder="CBC_Blood_Report.pdf"
              className="w-full px-3 py-2 bg-slate-55 dark:bg-slate-800 dark:text-white border border-slate-205 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden"
            />
            <button
              type="submit"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Add Report File
            </button>
          </form>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-955/20 text-amber-600 p-3 rounded-xl border border-amber-100 text-xs">
            Uploader limit reached (5 files max).
          </div>
        )}
      </div>
    </div>
  );
}
