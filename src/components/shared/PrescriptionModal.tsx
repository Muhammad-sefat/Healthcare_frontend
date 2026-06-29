"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | null;
}

export function PrescriptionModal({ isOpen, onClose, appointmentId }: PrescriptionModalProps) {
  const { writePrescription } = useAuth();
  const [prescriptionInstructions, setPrescriptionInstructions] = useState("");
  const [prescriptionFollowUp, setPrescriptionFollowUp] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPrescriptionInstructions("");
      setPrescriptionFollowUp("2026-06-30");
    }
  }, [isOpen]);

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;
    writePrescription(appointmentId, prescriptionInstructions, prescriptionFollowUp || "2026-06-30");
    toast.success("Prescription submitted.");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Write Consultation Prescription"
    >
      <form onSubmit={handlePrescriptionSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Clinical Instructions
          </label>
          <textarea
            rows={5}
            required
            value={prescriptionInstructions}
            onChange={(e) => setPrescriptionInstructions(e.target.value)}
            placeholder="Tab Napa Extend 665mg - 1+0+1 after food for 5 days..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-none focus:outline-hidden"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Follow-Up Date
          </label>
          <DatePicker
            value={prescriptionFollowUp}
            onChange={setPrescriptionFollowUp}
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer"
          >
            Save Prescription
          </button>
        </div>
      </form>
    </CustomModal>
  );
}
