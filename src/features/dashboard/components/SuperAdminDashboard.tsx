"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { Role, UserStatus } from "@/types";
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Plus, 
  Trash2 
} from "lucide-react";

interface SuperAdminDashboardProps {
  activeTab: string;
}

export function SuperAdminDashboard({ activeTab }: SuperAdminDashboardProps) {
  const {
    currentProfile,
    users,
    admins,
    createAdmin,
    deleteAdmin,
    changeUserStatus,
    changeUserRole
  } = useAuth();

  // Local UI states for Super Admin Actions
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

  if (activeTab === "overview") {
    const adminCount = admins.length;
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Stats widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admins</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {users.filter(u => u.role === Role.SUPER_ADMIN).length}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><Users className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Admins</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{adminCount}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><UserCheck className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Accounts</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{users.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
              Super Admin Security Console
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Super Admins possess security clearance keys. You can register new administrators, override admin roles, lock blocked accounts clinic-wide, and review central database metrics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "super-admins") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Directory & Registration</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage administrative directories and provision security keys for new admins.</p>
          </div>
          <button
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
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Admin Name</th>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
              {admins.map(adm => (
                <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex gap-2.5 items-center">
                      <img src={adm.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=30"} className="h-8 w-8 rounded-lg object-cover" />
                      <span>{adm.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{adm.email}</td>
                  <td className="py-4 px-4 text-slate-500">{adm.contactNumber}</td>
                  <td className="py-4 px-4 text-right">
                    {adm.email !== "super.sefat@clinic.com" ? (
                      <button
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
                <select value={adminRole} onChange={(e) => setAdminRole(e.target.value as Role)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-850 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700">
                  <option value={Role.ADMIN}>ADMIN</option>
                  <option value={Role.SUPER_ADMIN}>SUPER ADMIN</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
              <button type="button" onClick={() => setAdminModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Admin</button>
            </div>
          </form>
        </CustomModal>
      </div>
    );
  }

  if (activeTab === "super-users") {
    const targetUsers = users.filter(u => u.email !== currentProfile?.email);
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role & Status Moderation Controls</h2>
          <p className="text-xs text-slate-400 mt-1">Super Admin overrides. Lock user status clinic-wide or switch roles between ADMIN and SUPER_ADMIN.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">User Account Email</th>
                <th className="py-4 px-4">Active Role</th>
                <th className="py-4 px-4">System Status</th>
                <th className="py-4 px-4 text-center">Modify Status</th>
                <th className="py-4 px-4 text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
              {targetUsers.map(u => {
                const isStaff = u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                    <td className="py-4 px-4 text-slate-505">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        value={u.status}
                        onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                        className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        <option value={UserStatus.ACTIVE}>ACTIVE</option>
                        <option value={UserStatus.BLOCKED}>BLOCKED</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isStaff ? (
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                          className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          <option value={Role.ADMIN}>ADMIN</option>
                          <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                        </select>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium italic">Role Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
