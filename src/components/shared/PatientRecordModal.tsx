"use client";

import React from "react";
import { Patient } from "@/types";
import { CustomModal } from "@/components/ui/custom-modal";
import { FileText } from "lucide-react";
import { toast } from "sonner";

interface PatientRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function PatientRecordModal({ isOpen, onClose, patient }: PatientRecordModalProps) {
  if (!patient) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Health Record File"
      size="lg"
    >
      <div className="space-y-6 text-xs sm:text-sm">
        <div className="flex gap-4 items-center pb-4 border-b border-slate-100 dark:border-slate-850">
          <div className="h-14 w-14 rounded-full bg-slate-100 overflow-hidden border border-slate-100 dark:border-slate-700">
            <img
              src={
                patient.profilePhoto ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60"
              }
              alt={patient.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {patient.name}
            </h3>
            <span className="text-slate-500 font-medium block">
              Contact: {patient.contactNumber || "N/A"} &bull;{" "}
              {patient.email}
            </span>
          </div>
        </div>

        {patient.patientHealthData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Demographic Metrics
              </h4>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-350">
                <div className="flex justify-between">
                  <span>Gender:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.gender}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Blood Group:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.bloodGroup}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Height:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.height}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.weight}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Marital Status:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.maritalStatus}
                  </strong>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Clinical Disclosures
              </h4>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-350">
                <div className="flex justify-between">
                  <span>Diabetes:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.hasDiabetes ? "YES" : "NO"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Allergies:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.hasAllergies ? "YES" : "NO"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Dietary Pref:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.dietaryPreferences || "None"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Smoking Status:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.smokingStatus ? "YES" : "NO"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Mental Health notes:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {patient.patientHealthData.mentalHealthHistory || "None"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-xs italic">
            No health records compiled by patient.
          </p>
        )}

        {/* Medical reports list */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
            Uploaded Medical Reports
          </h4>
          {patient.medicalReports && patient.medicalReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patient.medicalReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-350 truncate">
                      {rep.reportName}
                    </span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Simulating report review...");
                    }}
                    className="text-primary hover:underline font-bold flex-shrink-0"
                  >
                    Review
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">
              No medical reports uploaded.
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 px-5 py-2 rounded-xl font-bold cursor-pointer"
          >
            Close File
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
