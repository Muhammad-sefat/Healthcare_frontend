"use client";

import React, { useState } from "react";
import { Doctor, Gender } from "@/types";
import { Plus, Trash2, ChevronDown, Lock, Upload } from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";
import { useAdminSpecialties } from "../hooks/useSpecialtyMutations";
import { useAdminDoctors, useCreateDoctor, useDeleteDoctor } from "../hooks/useDoctorMutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function DoctorDirectory() {
  const { data: doctorsResponse, isLoading } = useAdminDoctors();
  const createDoctorMutation = useCreateDoctor();
  const deleteDoctorMutation = useDeleteDoctor();

  const doctors = doctorsResponse?.data || [];
  const { data: specialtiesResponse } = useAdminSpecialties();
  const specialties = specialtiesResponse?.data || [];

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name: string } | null>(null);

  const [doctorImage, setDoctorImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setDoctorImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }
  };

  const handleCloseModal = () => {
    setDoctorName("");
    setDoctorEmail("");
    setDoctorPassword("");
    setDoctorPhone("");
    setDoctorAddress("");
    setDoctorReg("");
    setDoctorExp(5);
    setDoctorSpecs([]);
    setDoctorImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setDoctorModalOpen(false);
  };

  const handleRegisterDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !doctorEmail || !doctorPassword) {
      toast.error("Name, email, and password are required.");
      return;
    }
    if (doctorPassword.length < 6 || doctorPassword.length > 20) {
      toast.error("Password must be between 6 and 20 characters.");
      return;
    }
    if (doctorName.length < 5 || doctorName.length > 30) {
      toast.error("Name must be between 5 and 30 characters.");
      return;
    }
    if (doctorPhone.length < 11 || doctorPhone.length > 14) {
      toast.error("Contact number must be between 11 and 14 characters.");
      return;
    }
    if (doctorAddress && (doctorAddress.length < 10 || doctorAddress.length > 100)) {
      toast.error("Address must be between 10 and 100 characters.");
      return;
    }
    if (doctorSpecs.length === 0) {
      toast.error("At least one specialty is required.");
      return;
    }

    createDoctorMutation.mutate({
      password: doctorPassword,
      doctor: {
        name: doctorName,
        email: doctorEmail,
        contactNumber: doctorPhone,
        address: doctorAddress,
        registrationNumber: doctorReg,
        experience: doctorExp,
        gender: doctorGender as "MALE" | "FEMALE",
        appointmentFee: doctorFee,
        qualification: doctorQual,
        currentWorkplace: doctorWork,
        designation: doctorDesg
      },
      specialties: doctorSpecs,
      image: doctorImage
    }, {
      onSuccess: () => {
        handleCloseModal();
      }
    });
  };

  const triggerDeleteConfirm = (id: string, name: string) => {
    setDoctorToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      deleteDoctorMutation.mutate(doctorToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDoctorToDelete(null);
        }
      });
    }
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 text-xs animate-pulse">
                  Loading doctors database...
                </td>
              </tr>
            ) : activeDocs.length > 0 ? (
              activeDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex gap-2.5 items-center">
                      <img src={doc.profilePhoto || "https://img.icons8.com/color/96/doctor-male.png"} alt={doc.name} className="h-8 w-8 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0" />
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
                  <td className="py-4 px-4 text-slate-550">{doc.contactNumber}</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{doc.appointmentFee}</td>
                  <td className="py-4 px-4 text-center font-bold text-amber-500">{doc.averageRating} ★</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerDeleteConfirm(doc.id, doc.name)}
                      disabled={deleteDoctorMutation.isPending}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 text-xs font-semibold">
                  No doctors registered in the clinic database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Doctor Registry Modal Form */}
      <CustomModal
        isOpen={doctorModalOpen}
        onClose={handleCloseModal}
        title="Register Doctor Profile Account"
        size="lg"
      >
        <form onSubmit={handleRegisterDoctorSubmit} className="space-y-5 text-xs">
          {/* Profile Image Upload Region */}
          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Profile Photo / Image</label>
            <div className="relative group border border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col items-center justify-center text-center min-h-[140px]">
              {imagePreview ? (
                <div className="space-y-3 w-full flex flex-col items-center animate-fadeIn">
                  <div className="relative h-16 w-16 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                      {doctorImage?.name}
                    </span>
                    <span className="text-[10px] text-slate-405 mt-0.5">
                      {doctorImage ? (doctorImage.size / 1024).toFixed(1) : 0} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageChange(null)}
                    className="text-[10px] font-bold text-red-500 hover:text-white hover:bg-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageChange(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary dark:text-slate-500 dark:group-hover:text-primary border border-slate-100 dark:border-slate-750 shadow-xs mb-2 transition-all duration-300 group-hover:scale-110">
                    <Upload className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Choose profile picture to upload
                  </span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 font-medium">
                    PNG or JPG (Max 5MB)
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Doctor Name</label>
              <input type="text" required value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. John Carter" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
              <input type="email" required value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} placeholder="john.c@clinic.com" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Lock className="h-3 w-3 text-slate-400" />
                Password
              </label>
              <input type="password" required value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Contact Number</label>
              <input type="text" value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} placeholder="01712345679" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Registration ID Number</label>
              <input type="text" required value={doctorReg} onChange={(e) => setDoctorReg(e.target.value)} placeholder="DMC-98726" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Experience (Years)</label>
              <input type="number" value={doctorExp} onChange={(e) => setDoctorExp(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Gender</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left font-medium cursor-pointer focus:outline-hidden text-xs"
                  >
                    <span>{doctorGender}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-md p-1">
                  <DropdownMenuItem
                    onClick={() => setDoctorGender(Gender.MALE)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                  >
                    MALE
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDoctorGender(Gender.FEMALE)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                  >
                    FEMALE
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Consult Fee</label>
              <input type="number" value={doctorFee} onChange={(e) => setDoctorFee(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Qualifications</label>
              <input type="text" value={doctorQual} onChange={(e) => setDoctorQual(e.target.value)} placeholder="MBBS, MD (Cardiology)" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Workplace Hospital</label>
              <input type="text" value={doctorWork} onChange={(e) => setDoctorWork(e.target.value)} placeholder="National Heart Foundation" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Hospital Room / Address</label>
            <input type="text" value={doctorAddress} onChange={(e) => setDoctorAddress(e.target.value)} placeholder="Chamber 302, Floor 3" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden" />
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
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={createDoctorMutation.isPending} className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50">
              {createDoctorMutation.isPending ? "Registering..." : "Register Doctor"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Delete Confirmation Modal using Shadcn */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl animate-fadeIn">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirm Doctor Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete the doctor profile of <span className="font-semibold text-slate-800 dark:text-slate-200">"{doctorToDelete?.name}"</span>? This will permanently disable their login and remove them from all listings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                setDoctorToDelete(null);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteDoctorMutation.isPending}
              className="bg-red-500 hover:bg-red-650 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {deleteDoctorMutation.isPending ? "Deleting..." : "Delete Doctor"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
