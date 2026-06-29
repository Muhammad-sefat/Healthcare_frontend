"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/authProvider";
import { Role, Appointment } from "@/types";
import { CustomModal } from "@/components/ui/custom-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function VideoCallModal({ isOpen, onClose, appointment }: VideoCallModalProps) {
  const { activeRole, startConsultation, completeAppointment, writePrescription } = useAuth();
  const [callTimer, setCallTimer] = useState(0);
  const [muteAudio, setMuteAudio] = useState(false);
  const [stopVideo, setStopVideo] = useState(false);

  const [prescriptionInstructions, setPrescriptionInstructions] = useState("");
  const [prescriptionFollowUp, setPrescriptionFollowUp] = useState("");

  // Start call simulation
  useEffect(() => {
    if (isOpen && appointment) {
      startConsultation(appointment.id);
      setPrescriptionInstructions("");
      setPrescriptionFollowUp("2026-06-30");
    }
  }, [isOpen, appointment]);

  // Timer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isOpen) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  const handleEndVideoCall = () => {
    if (appointment) {
      completeAppointment(appointment.id);
    }
    onClose();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!appointment) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleEndVideoCall}
      title="Live Video Consultation Call"
      size="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
        {/* Left: Video Streams (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-slate-900 shadow-inner">
          <div className="absolute inset-0 z-0">
            {!stopVideo ? (
              <img
                src={
                  activeRole === Role.PATIENT
                    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                }
                alt="Remote consultation stream"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs font-semibold">
                Video Stream Muted
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 h-32 w-24 rounded-lg bg-slate-900 overflow-hidden border border-slate-800 shadow-lg z-10">
            <img
              src={
                activeRole === Role.PATIENT
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
              }
              alt="Local stream"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 z-20 shadow-xl text-xs font-bold text-white">
            <span className="font-mono">{formatTimer(callTimer)}</span>
            <span className="text-slate-800">|</span>
            <button
              type="button"
              onClick={() => setMuteAudio(!muteAudio)}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${muteAudio ? "bg-rose-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            >
              Mute
            </button>
            <button
              type="button"
              onClick={() => setStopVideo(!stopVideo)}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${stopVideo ? "bg-rose-500 text-white" : "hover:bg-slate-800 text-slate-400"}`}
            >
              Stop Cam
            </button>
            <button
              type="button"
              onClick={handleEndVideoCall}
              className="bg-rose-500 text-white hover:bg-rose-600 px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Right Panel: Prescription/Notes (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="space-y-4 flex-grow overflow-y-auto pr-1">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Active Case File</h4>
              <span className="text-[10px] text-slate-400 block mt-0.5">Patient: {appointment.patient.name}</span>
            </div>

            {activeRole === Role.DOCTOR ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase">Clinical Prescriptions</label>
                  <textarea
                    rows={6}
                    value={prescriptionInstructions}
                    onChange={(e) => setPrescriptionInstructions(e.target.value)}
                    placeholder="Type instructions here to prescribe and complete the session..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl resize-none text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-455 uppercase">Follow-Up Date</label>
                  <DatePicker
                    value={prescriptionFollowUp}
                    onChange={setPrescriptionFollowUp}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
                <p>You are now connected to a secure, end-to-end encrypted video session with your specialist.</p>
                <p>Please speak clearly and disclose all medical conditions, histories, and allergies to assist the practitioner.</p>
                <p>Your doctor will write instructions here which will appear directly in your prescriptions archive once the call ends.</p>
              </div>
            )}
          </div>

          {activeRole === Role.DOCTOR && (
            <button
              type="button"
              onClick={() => {
                if (!prescriptionInstructions) {
                  toast.error("Please type clinical instructions before finalizing prescription.");
                  return;
                }
                writePrescription(appointment.id, prescriptionInstructions, prescriptionFollowUp || "2026-06-30");
                onClose();
                toast.success("Prescription submitted. Consultation finished.");
              }}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold shadow-md cursor-pointer text-xs"
            >
              Finalize Case
            </button>
          )}
        </div>
      </div>
    </CustomModal>
  );
}
