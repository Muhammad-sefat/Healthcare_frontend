"use client";

import React, { useState } from "react";
import { Doctor, Specialty, Gender } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface DoctorDirectoryProps {
  doctors: Doctor[];
  specialties: Specialty[];
  registerDoctor: (doctor: any, specs: string[]) => void;
  deleteDoctor: (id: string) => void;
}

export function DoctorDirectory({
  doctors,
  specialties,
  registerDoctor,
  deleteDoctor,
}: DoctorDirectoryProps) {
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorReg, setDoctorReg] = useState("");
  const [doctorExp, setDoctorExp] = useState(5);
  const [doctorGender, setDoctorGender] = useState<Gender>(Gender.MALE);
  const [doctorFee, setDoctorFee] = useState(1000);
  const [doctorQual, setDoctorQual] = useState("");
  const [doctorWork, setDoctorWork] = useState("");
  const [doctorDesg, setDoctorDesg] = useState("Consultant");
  const [doctorSpecs, setDoctorSpecs] = useState<string[]>([]);

  const handleRegisterDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !doctorEmail) return;
    registerDoctor({
      name: doctorName,
      email: doctorEmail,
      contactNumber: doctorPhone,
      address: doctorAddress,
      registrationNumber: doctorReg,
      experience: doctorExp,
      gender: doctorGender,
      appointmentFee: doctorFee,
      qualification: doctorQual,
      currentWorkplace: doctorWork,
      designation: doctorDesg
    }, doctorSpecs);

    setDoctorName("");
    setDoctorEmail("");
    setDoctorPhone("");
    setDoctorAddress("");
    setDoctorReg("");
    setDoctorExp(5);
    setDoctorSpecs([]);
    setDoctorModalOpen(false);
  };

  const toggleSpecialtySelection = (specId: string) => {
    setDoctorSpecs(prev => 
      prev.includes(specId) ? prev.filter(id => id !== specId) : [...prev, specId]
    );
  };

  const activeDocs = doctors.filter(d => !d.isDeleted);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doctor Directory CRUD</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage doctor account registrations, specialties tags, qualifications, and consulting fees.</p>
        </div>
        <button
          type="button"
          onClick={() => setDoctorModalOpen(true)}
          className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Register Doctor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Doctor Name</th>
              <th className="py-4 px-4">Workplace Details</th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4 text-center">Consult Fee</th>
              <th className="py-4 px-4 text-center">Rating</th>
              <th className="py-4 px-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {activeDocs.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex gap-2.5 items-center">
                    <img src={doc.profilePhoto} alt={doc.name} className="h-8 w-8 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0" />
                    <div>
                      <span>{doc.name}</span>
                      <span className="block text-[9px] text-primary font-bold mt-0.5">{doc.specialties[0]?.specialty?.title || "General"}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-500">
                  <span className="block font-semibold">{doc.designation}</span>
                  <span className="block text-[10px] text-slate-405 mt-0.5">{doc.currentWorkplace}</span>
                </td>
                <td className="py-4 px-4 text-slate-505">{doc.contactNumber}</td>
                <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{doc.appointmentFee}</td>
                <td className="py-4 px-4 text-center font-bold text-amber-500">{doc.averageRating} ★</td>
                <td className="py-4 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => deleteDoctor(doc.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor Registry Modal Form */}
      <CustomModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        title="Register Doctor Profile Account"
        size="lg"
      >
        <form onSubmit={handleRegisterDoctorSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Doctor Name</label>
              <input type="text" required value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. John Carter" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
              <input type="email" required value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} placeholder="john.c@clinic.com" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Contact Number</label>
              <input type="text" value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} placeholder="01712345679" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Registration ID Number</label>
              <input type="text" required value={doctorReg} onChange={(e) => setDoctorReg(e.target.value)} placeholder="DMC-98726" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Experience (Years)</label>
              <input type="number" value={doctorExp} onChange={(e) => setDoctorExp(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Gender</label>
              <select value={doctorGender} onChange={(e) => setDoctorGender(e.target.value as Gender)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700">
                <option value={Gender.MALE}>MALE</option>
                <option value={Gender.FEMALE}>FEMALE</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Consult Fee</label>
              <input type="number" value={doctorFee} onChange={(e) => setDoctorFee(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Qualifications</label>
              <input type="text" value={doctorQual} onChange={(e) => setDoctorQual(e.target.value)} placeholder="MBBS, MD (Cardiology)" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Workplace Hospital</label>
              <input type="text" value={doctorWork} onChange={(e) => setDoctorWork(e.target.value)} placeholder="National Heart Foundation" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
          </div>

          {/* Specialties Tag selection */}
          <div className="space-y-2">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Specialty Assignment Tags</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map(spec => {
                const isSelected = doctorSpecs.includes(spec.id);
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => toggleSpecialtySelection(spec.id)}
                    className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "border-slate-200 text-slate-500 hover:border-primary/50 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {spec.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setDoctorModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Doctor</button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
