"use client";

import React, { useState } from "react";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import {
  useGetMyDoctorSchedules,
  useClaimSlot,
  useReleaseSlot,
} from "../hooks/useSlotMutations";

export function ManageSlots() {
  const { data: globalSchedulesResponse, isLoading: isLoadingGlobal } =
    useGetSchedules();
  const { data: mySchedulesResponse, isLoading: isLoadingMySchedules } =
    useGetMyDoctorSchedules();

  const globalSchedules = globalSchedulesResponse?.data || [];
  const mySchedules = mySchedulesResponse?.data || [];

  const claimMutation = useClaimSlot();
  const releaseMutation = useReleaseSlot();

  // Track individual button loading states
  const [loadingClaimId, setLoadingClaimId] = useState<string | null>(null);
  const [loadingReleaseId, setLoadingReleaseId] = useState<string | null>(null);

  // Extract set of claimed scheduleIds to prevent duplicate display
  const claimedScheduleIds = new Set(mySchedules.map((ds) => ds.scheduleId));

  // Show master template schedules that are NOT yet claimed by the doctor
  const availableToClaim = globalSchedules.filter(
    (s) => !claimedScheduleIds.has(s.id),
  );

  const handleClaim = (scheduleId: string) => {
    setLoadingClaimId(scheduleId);
    claimMutation.mutate(
      {
        scheduleIds: [scheduleId],
      },
      {
        onSettled: () => {
          setLoadingClaimId(null);
        },
      },
    );
  };

  const handleRelease = (scheduleId: string) => {
    setLoadingReleaseId(scheduleId);
    releaseMutation.mutate(scheduleId, {
      onSettled: () => {
        setLoadingReleaseId(null);
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Clinic Slot Availability
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Claim general clinic schedule intervals to open booking slots, or
          release slots that are no longer available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Available to Claim */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Available Clinic Slots
            </h2>
            <p className="text-[10px] text-slate-450 mt-1">
              Select from the clinics master template to define your consulting
              hours.
            </p>
          </div>

          {isLoadingGlobal || isLoadingMySchedules ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 bg-slate-50 dark:bg-slate-850 rounded-xl"
                />
              ))}
            </div>
          ) : availableToClaim.length > 0 ? (
            <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
              {availableToClaim.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-xs transition-all hover:bg-slate-100/50"
                >
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-800 dark:text-slate-200">
                      {formatDate(slot.startDateTime)}
                    </span>
                    <span className="block text-[10px] text-slate-450">
                      {formatTime(slot.startDateTime)} -{" "}
                      {formatTime(slot.endDateTime)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClaim(slot.id)}
                    disabled={loadingClaimId === slot.id}
                    className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50 min-w-22.5 text-center"
                  >
                    {loadingClaimId === slot.id ? "Claiming..." : "Claim Slot"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-slate-400 text-[11px] font-semibold border border-dashed border-slate-200 dark:border-slate-800">
              No available clinic slots left to claim.
            </div>
          )}
        </div>

        {/* Right Column: Claimed Schedules */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              My Active Claimed Slots
            </h2>
            <p className="text-[10px] text-slate-450 mt-1">
              Your registered consultation availability. Booked slots are
              locked.
            </p>
          </div>

          {isLoadingGlobal || isLoadingMySchedules ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 bg-slate-50 dark:bg-slate-850 rounded-xl"
                />
              ))}
            </div>
          ) : mySchedules.length > 0 ? (
            <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
              {mySchedules.map((ds) => {
                const isBooked = ds.isBooked;
                return (
                  <div
                    key={ds.scheduleId}
                    className={`flex items-center justify-between p-3.5 border rounded-2xl text-xs transition-all ${
                      isBooked
                        ? "bg-emerald-50/40 dark:bg-emerald-950/5 border-emerald-150 text-emerald-800 dark:text-emerald-400"
                        : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-slate-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {formatDate(ds.schedule.startDateTime)}
                        </span>
                        {isBooked && (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Booked
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-450">
                        {formatTime(ds.schedule.startDateTime)} -{" "}
                        {formatTime(ds.schedule.endDateTime)}
                      </span>
                    </div>

                    {!isBooked && (
                      <button
                        type="button"
                        onClick={() => handleRelease(ds.scheduleId)}
                        disabled={loadingReleaseId === ds.scheduleId}
                        className="bg-rose-50 hover:bg-rose-100/60 text-rose-500 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50 min-w-[75px] text-center"
                      >
                        {loadingReleaseId === ds.scheduleId
                          ? "Releasing..."
                          : "Release"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-855/50 rounded-2xl text-slate-400 text-[11px] font-semibold border border-dashed border-slate-200 dark:border-slate-800">
              You havent claimed any schedule slots yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
