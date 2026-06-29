"use client";

import React, { useState } from "react";
import { Role } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface CreateAdminProps {
  admins: any[];
  createAdmin: (name: string, email: string, phone: string, role: Role) => void;
  deleteAdmin: (id: string) => void;
}

export function CreateAdmin({
  admins,
  createAdmin,
  deleteAdmin,
}: CreateAdminProps) {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminRole, setAdminRole] = useState<Role>(Role.ADMIN);

  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminEmail) return;
    createAdmin(adminName, adminEmail, adminPhone, adminRole);
    setAdminName("");
    setAdminEmail("");
    setAdminPhone("");
    setAdminModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Directory & Registration</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage administrative directories and provision security keys for new admins.</p>
        </div>
        <button
          type="button"
          onClick={() => setAdminModalOpen(true)}
          className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Register Admin
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">Admin Name</th>
              <th className="py-4 px-4">Email Address</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
            {admins.map(adm => (
              <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex gap-2.5 items-center">
                    <img src={adm.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=30"} alt={adm.name} className="h-8 w-8 rounded-lg object-cover" />
                    <span>{adm.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-500">{adm.email}</td>
                <td className="py-4 px-4 text-slate-505">{adm.contactNumber}</td>
                <td className="py-4 px-4 text-right">
                  {adm.email !== "super.sefat@clinic.com" ? (
                    <button
                      type="button"
                      onClick={() => deleteAdmin(adm.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">System Core</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Creation Modal Form */}
      <CustomModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        title="Register Clinic Administrative account"
      >
        <form onSubmit={handleCreateAdminSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Admin Full Name</label>
            <input type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Alex Vance" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
          </div>
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
            <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin.alex@clinic.com" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Phone</label>
              <input type="text" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="01711223344" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Select Role</label>
              <select value={adminRole} onChange={(e) => setAdminRole(e.target.value as Role)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-850 dark:text-white rounded-xl border border-slate-205 dark:border-slate-700">
                <option value={Role.ADMIN}>ADMIN</option>
                <option value={Role.SUPER_ADMIN}>SUPER ADMIN</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
            <button type="button" onClick={() => setAdminModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Admin</button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
