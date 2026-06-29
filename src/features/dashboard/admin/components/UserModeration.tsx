"use client";

import React from "react";
import { User, UserStatus } from "@/types";

interface UserModerationProps {
  users: User[];
  changeUserStatus: (id: string, status: UserStatus) => void;
}

export function UserModeration({
  users,
  changeUserStatus,
}: UserModerationProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Account Moderation</h2>
        <p className="text-xs text-slate-400 mt-1">Review system accounts credentials, modify registration dates, or toggle account block status.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">User Email</th>
              <th className="py-4 px-4">Role Clearance</th>
              <th className="py-4 px-4">Created Date</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                <td className="py-4 px-4 text-slate-500">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                    u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450" : "bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-400"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <select
                    value={u.status}
                    onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                    className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    <option value={UserStatus.ACTIVE}>ACTIVE</option>
                    <option value={UserStatus.BLOCKED}>BLOCKED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
