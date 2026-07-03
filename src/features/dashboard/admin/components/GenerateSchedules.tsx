/* eslint-disable prefer-const */
"use client";

import React, { useState } from "react";
import { Schedule } from "../types/schedule";
import { Plus, Pencil, Eye, Trash2, ChevronDown } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomModal } from "@/components/ui/custom-modal";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import {
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from "../hooks/useScheduleMutations";
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

export function GenerateSchedules() {
  const { data: schedulesResponse, isLoading } = useGetSchedules();
  const schedules = schedulesResponse?.data || [];

  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();

  // Modal open triggers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );

  // Form states
  const [startDate, setStartDate] = useState("2026-07-20");
  const [endDate, setEndDate] = useState("2026-07-22");

  // Dropdown time states in 12-hour AM/PM format
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("12:00 PM");

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      const isPM = h >= 12;
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      const hourStr = String(displayHour).padStart(2, "0");
      const period = isPM ? "PM" : "AM";
      options.push(`${hourStr}:00 ${period}`);
      options.push(`${hourStr}:30 ${period}`);
    }
    return options;
  };
  const timeOptions = generateTimeOptions();

  // Converter from 12-hour (02:30 PM) to 24-hour (14:30) for backend payload
  const to24Hour = (time12h: string) => {
    const [timePart, period] = time12h.split(" ");
    let [hourStr, minStr] = timePart.split(":");
    let hour = parseInt(hourStr, 10);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return `${String(hour).padStart(2, "0")}:${minStr}`;
  };

  // Converter from 24-hour (14:30) to 12-hour (02:30 PM) for frontend selection display
  const to12Hour = (time24h: string) => {
    const [hourStr, minStr] = time24h.split(":");
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(displayHour).padStart(2, "0")}:${minStr} ${period}`;
  };

  const resetForm = () => {
    setStartDate("2026-07-20");
    setEndDate("2026-07-22");
    setStartTime("09:00 AM");
    setEndTime("12:00 PM");
    setSelectedSchedule(null);
  };

  const handleCloseCreate = () => {
    setCreateModalOpen(false);
    resetForm();
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    resetForm();
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    resetForm();
  };

  const handleCloseDelete = () => {
    setDeleteModalOpen(false);
    resetForm();
  };

  const getLocalDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  };

  const getLocalTimeString = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const handleOpenEdit = (schedule: Schedule) => {
    if (schedule.isBooked) {
      toast.error("Booked schedules cannot be modified.");
      return;
    }
    setSelectedSchedule(schedule);
    setStartDate(getLocalDateString(schedule.startDateTime));
    setEndDate(getLocalDateString(schedule.endDateTime));
    setStartTime(to12Hour(getLocalTimeString(schedule.startDateTime)));
    setEndTime(to12Hour(getLocalTimeString(schedule.endDateTime)));
    setEditModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !startTime || !endTime) {
      toast.error("All parameters are required.");
      return;
    }
    createMutation.mutate(
      {
        startDate,
        endDate,
        startTime: to24Hour(startTime),
        endTime: to24Hour(endTime),
      },
      {
        onSuccess: () => {
          handleCloseCreate();
        },
      },
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    updateMutation.mutate(
      {
        id: selectedSchedule.id,
        payload: {
          startDate,
          endDate,
          startTime: to24Hour(startTime),
          endTime: to24Hour(endTime),
        },
      },
      {
        onSuccess: () => {
          handleCloseEdit();
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!selectedSchedule) return;
    deleteMutation.mutate(selectedSchedule.id, {
      onSuccess: () => {
        handleCloseDelete();
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

  const formatTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const end = new Date(endStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Clinic Scheduling Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate system-wide time slots, edit schedule details, and review
            bookings.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setCreateModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Generate Slots
        </button>
      </div>

      {/* Grid Cards Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 space-y-4"
            >
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-2/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2" />
              <div className="h-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : schedules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
          {schedules.map((slot) => {
            const isBooked = slot.isBooked;
            return (
              <div
                key={slot.id}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Date & Slot
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isBooked
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                      }`}
                    >
                      {isBooked ? "Booked" : "Available"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-900 dark:text-white text-xs truncate">
                      {formatDate(slot.startDateTime)}
                    </span>
                    <span className="block text-[11px] font-semibold text-slate-500">
                      {formatTimeRange(slot.startDateTime, slot.endDateTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <button
                    onClick={() => {
                      setSelectedSchedule(slot);
                      setDetailsModalOpen(true);
                    }}
                    title="View Details"
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-500 rounded-lg cursor-pointer transition-all"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(slot)}
                    disabled={isBooked}
                    title="Edit Slot"
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-500 hover:text-primary rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSchedule(slot);
                      setDeleteModalOpen(true);
                    }}
                    disabled={isBooked}
                    title="Delete Slot"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs font-semibold">
          No schedules generated in the clinic database.
        </div>
      )}

      {/* Generate Schedule Modal */}
      <CustomModal
        isOpen={createModalOpen}
        onClose={handleCloseCreate}
        title="Generate System-Wide Schedules"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                Start Date
              </label>
              <DatePicker value={startDate} onChange={setStartDate} />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                End Date
              </label>
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                Start Time
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left font-semibold cursor-pointer focus:outline-hidden text-xs"
                  >
                    <span>{startTime}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-md p-1 z-50">
                  {timeOptions.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => setStartTime(time)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-205 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                End Time
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left font-semibold cursor-pointer focus:outline-hidden text-xs"
                  >
                    <span>{endTime}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-md p-1 z-50">
                  {timeOptions.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => setEndTime(time)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-205 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCloseCreate}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {createMutation.isPending ? "Generating..." : "Generate Slots"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Edit Schedule Modal */}
      <CustomModal
        isOpen={editModalOpen}
        onClose={handleCloseEdit}
        title="Modify Schedule Slot Time"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                Start Date
              </label>
              <DatePicker value={startDate} onChange={setStartDate} />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                End Date
              </label>
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                Start Time
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left font-semibold cursor-pointer focus:outline-hidden text-xs"
                  >
                    <span>{startTime}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-md p-1 z-50">
                  {timeOptions.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => setStartTime(time)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-205 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">
                End Time
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left font-semibold cursor-pointer focus:outline-hidden text-xs"
                  >
                    <span>{endTime}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-md p-1 z-50">
                  {timeOptions.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => setEndTime(time)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-205 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer outline-hidden"
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCloseEdit}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Details View Modal */}
      <CustomModal
        isOpen={detailsModalOpen}
        onClose={handleCloseDetails}
        title="Schedule Slot Details"
        size="sm"
      >
        {selectedSchedule && (
          <div className="space-y-4 text-xs">
            <div className="space-y-3 bg-slate-50 dark:bg-slate-855 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="font-semibold text-slate-400">
                  Schedule ID
                </span>
                <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 select-all">
                  {selectedSchedule.id}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="font-semibold text-slate-400">Start Time</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {new Date(selectedSchedule.startDateTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="font-semibold text-slate-400">End Time</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {new Date(selectedSchedule.endDateTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="font-semibold text-slate-400">Status</span>
                <span
                  className={`font-bold ${
                    selectedSchedule.isBooked
                      ? "text-emerald-500"
                      : "text-blue-500"
                  }`}
                >
                  {selectedSchedule.isBooked
                    ? "Booked by Patient"
                    : "Available"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-400">Created At</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {new Date(selectedSchedule.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCloseDetails}
                className="bg-slate-900 text-white dark:bg-slate-850 px-5 py-2 rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-all text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Delete Confirmation Modal using Shadcn */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl animate-fadeIn">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirm Schedule Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete this schedule slot from the
              database? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={handleCloseDelete}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-650 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Slot"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
