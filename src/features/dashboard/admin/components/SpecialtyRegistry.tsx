"use client";

import React, { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";
import { useAdminSpecialties, useCreateSpecialty, useDeleteSpecialty } from "../hooks/useSpecialtyMutations";
import { toast } from "sonner";
import { useAuth } from "@/providers/authProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function SpecialtyRegistry() {
  const { data: specialtiesResponse, isLoading } = useAdminSpecialties();
  const createSpecialtyMutation = useCreateSpecialty();
  const deleteSpecialtyMutation = useDeleteSpecialty();
  const { currentProfile } = useAuth();
  const adminId = currentProfile?.userId;

  const specialties = specialtiesResponse?.data || [];

  const [specialtyModalOpen, setSpecialtyModalOpen] = useState(false);
  const [specialtyTitle, setSpecialtyTitle] = useState("");
  const [specialtyDesc, setSpecialtyDesc] = useState("");
  const [specialtyImage, setSpecialtyImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setSpecialtyImage(file);
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
    setSpecialtyTitle("");
    setSpecialtyDesc("");
    setSpecialtyImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSpecialtyModalOpen(false);
  };

  const handleAddSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialtyTitle) {
      toast.error("Specialty title is required.");
      return;
    }
    if (!specialtyImage) {
      toast.error("Specialty image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", specialtyTitle);
    formData.append("description", specialtyDesc);
    formData.append("image", specialtyImage);
    if (adminId) {
      formData.append("adminId", adminId);
    } else {
      toast.error("Admin ID not found. Please log in again.");
      return;
    }

    createSpecialtyMutation.mutate(formData, {
      onSuccess: () => {
        handleCloseModal();
      }
    });
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<{ id: string; title: string } | null>(null);

  const triggerDeleteConfirm = (id: string, title: string) => {
    setSpecialtyToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (specialtyToDelete) {
      deleteSpecialtyMutation.mutate(specialtyToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSpecialtyToDelete(null);
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      {/* Specialties List */}
      <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Specialty Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">List of medical specialties currently active in the clinic database.</p>
          </div>
          <button
            type="button"
            onClick={() => setSpecialtyModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Specialty
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs animate-pulse">
              Loading specialties database...
            </div>
          ) : specialties.length > 0 ? (
            specialties.map(spec => (
              <div key={spec.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800">
                    <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{spec.title}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[180px] block mt-0.5">{spec.description}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDeleteConfirm(spec.id, spec.title)}
                  disabled={deleteSpecialtyMutation.isPending}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-405 font-medium">
              No specialties registered in history log.
            </div>
          )}
        </div>
      </div>

      {/* Specialty Modal form */}
      <CustomModal
        isOpen={specialtyModalOpen}
        onClose={handleCloseModal}
        title="Register Medical Specialty"
      >
        <form onSubmit={handleAddSpecialtySubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty Title</label>
            <input
              type="text"
              required
              value={specialtyTitle}
              onChange={(e) => setSpecialtyTitle(e.target.value)}
              placeholder="Cardiology / Neurology"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              rows={4}
              required
              value={specialtyDesc}
              onChange={(e) => setSpecialtyDesc(e.target.value)}
              placeholder="Summarize specialty clinical treatments..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-405 dark:text-slate-400 uppercase tracking-wider">Specialty Icon / Image</label>
            <div className="relative group border border-dashed border-slate-250 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col items-center justify-center text-center min-h-[140px]">
              {imagePreview ? (
                <div className="space-y-3 w-full flex flex-col items-center animate-fadeIn">
                  <div className="relative h-16 w-16 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                      {specialtyImage?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {specialtyImage ? (specialtyImage.size / 1024).toFixed(1) : 0} KB
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
                    required
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
                    Choose file to upload
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                    PNG, JPG or SVG (Max 5MB)
                  </span>
                </label>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSpecialtyMutation.isPending}
              className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {createSpecialtyMutation.isPending ? "Adding..." : "Add Specialty"}
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
              Confirm Specialty Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete the specialty <span className="font-semibold text-slate-800 dark:text-slate-200">"{specialtyToDelete?.title}"</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                setSpecialtyToDelete(null);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteSpecialtyMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {deleteSpecialtyMutation.isPending ? "Deleting..." : "Delete Specialty"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
