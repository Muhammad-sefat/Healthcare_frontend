"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { 
  AppointmentStatus, 
  PaymentStatus, 
  UserStatus, 
  Gender, 
  Role 
} from "@/types";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Stethoscope, 
  Plus, 
  Trash2,
  Filter
} from "lucide-react";

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const {
    appointments,
    users,
    doctors,
    specialties,
    schedules,
    addSpecialty,
    deleteSpecialty,
    generateSchedules,
    registerDoctor,
    deleteDoctor,
    changeUserStatus,
    updateAppointmentStatus,
  } = useAuth();

  // ----------------------------------------------------
  // Local UI States for Admin Actions
  // ----------------------------------------------------
  const [specialtyModalOpen, setSpecialtyModalOpen] = useState(false);
  const [specialtyTitle, setSpecialtyTitle] = useState("");
  const [specialtyDesc, setSpecialtyDesc] = useState("");

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

  // Schedule template generator inputs
  const [genStartD, setGenStartD] = useState("2026-07-01");
  const [genEndD, setGenEndD] = useState("2026-07-05");
  const [genStartT, setGenStartT] = useState("09:00");
  const [genEndT, setGenEndT] = useState("17:00");

  const handleAddSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialtyTitle || !specialtyDesc) return;
    addSpecialty(specialtyTitle, specialtyDesc, "");
    setSpecialtyTitle("");
    setSpecialtyDesc("");
    setSpecialtyModalOpen(false);
  };

  const handleGenerateSlotsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateSchedules(genStartD, genEndD, genStartT, genEndT);
    toast.success("System schedules generated dynamically.");
  };

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

  if (activeTab === "overview") {
    const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);
    const totalRevenue = appointments.filter(a => a.paymentStatus === PaymentStatus.PAID).reduce((sum, a) => sum + a.doctor.appointmentFee, 0);
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Stats matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Appointments</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{appointments.length}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><Users className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Users</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{activeUsers.length}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Revenue</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳{totalRevenue}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 rounded-2xl"><Stethoscope className="h-6 w-6" /></div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Doctors</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{doctors.filter(d => !d.isDeleted).length}</span>
            </div>
          </div>
        </div>

        {/* SVG Bar Chart and Donut charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
              Monthly Appointment Traffic
            </h3>
            
            {/* SVG Bar Chart */}
            <div className="h-64 w-full flex items-end justify-between px-2 pt-4">
              {[
                { month: "Jan", count: 20 },
                { month: "Feb", count: 25 },
                { month: "Mar", count: 32 },
                { month: "Apr", count: 38 },
                { month: "May", count: 42 },
                { month: "Jun", count: 27 }
              ].map((item, idx) => {
                const maxVal = 50;
                const heightPercent = (item.count / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-8 bg-primary/10 group-hover:bg-primary/20 rounded-t-lg flex items-end h-48 transition-colors">
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all duration-500" 
                        style={{ height: `${heightPercent}%` }}
                      />
                      {/* Hover Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
              Appointments Distribution
            </h3>
            <div className="space-y-4 py-4">
              {["COMPLETED", "SCHEDULED", "CANCELED"].map(status => {
                const count = appointments.filter(a => a.status === status).length;
                const total = appointments.length || 1;
                const percent = Math.round((count / total) * 100);
                const colors = {
                  COMPLETED: "bg-emerald-500",
                  SCHEDULED: "bg-primary",
                  CANCELED: "bg-rose-500"
                };
                return (
                  <div key={status} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-500">{status}</span>
                      <span className="text-slate-800 dark:text-slate-200">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[status as keyof typeof colors]}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "admin-specialties") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        {/* Specialties List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Specialty Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">List of medical specialties currently active in the clinic database.</p>
            </div>
            <button
              onClick={() => setSpecialtyModalOpen(true)}
              className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Specialty
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specialties.map(spec => (
              <div key={spec.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800">
                    <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{spec.title}</span>
                    <span className="text-[10px] text-slate-405 text-slate-400 truncate max-w-[150px] block mt-0.5">{spec.description}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteSpecialty(spec.id)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Modal form */}
        <CustomModal
          isOpen={specialtyModalOpen}
          onClose={() => setSpecialtyModalOpen(false)}
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
            
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSpecialtyModalOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-550 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Add Specialty
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    );
  }

  if (activeTab === "admin-schedules") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        {/* Generator Form Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <form onSubmit={handleGenerateSlotsSubmit} className="space-y-5 text-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clinic Slot Generator</h3>
              <p className="text-[10px] text-slate-400 mt-1">Generate 30-minute interval blocks daily across a specified date range.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                <DatePicker
                  value={genStartD}
                  onChange={setGenStartD}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                <DatePicker
                  value={genEndD}
                  onChange={setGenEndD}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Start Time</label>
                <input
                  type="time"
                  value={genStartT}
                  onChange={(e) => setGenStartT(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-755"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase">End Time</label>
                <input
                  type="time"
                  value={genEndT}
                  onChange={(e) => setGenEndT(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-755"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Generate Time Blocks
            </button>
          </form>
        </div>

        {/* Slots Table Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-855 pb-3">
            Generated System Time Blocks ({schedules.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
            {schedules.map((slot) => {
              const startStr = new Date(slot.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " @ " + new Date(slot.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={slot.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-350 flex justify-between items-center">
                  <span>{startStr}</span>
                  {slot.isBooked && (
                    <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-sm font-bold">Booked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "admin-doctors") {
    const activeDocs = doctors.filter(d => !d.isDeleted);
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doctor Directory CRUD</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage doctor account registrations, specialties tags, qualifications, and consulting fees.</p>
          </div>
          <button
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
              <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Doctor Name</th>
                <th className="py-4 px-4">Workplace Details</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4 text-center">Consult Fee</th>
                <th className="py-4 px-4 text-center">Rating</th>
                <th className="py-4 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
              {activeDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex gap-2.5 items-center">
                      <img src={doc.profilePhoto} className="h-8 w-8 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0" />
                      <div>
                        <span>{doc.name}</span>
                        <span className="block text-[9px] text-primary font-bold mt-0.5">{doc.specialties[0]?.specialty?.title || "General"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    <span className="block font-semibold">{doc.designation}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{doc.currentWorkplace}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{doc.contactNumber}</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-855 dark:text-slate-200">৳{doc.appointmentFee}</td>
                  <td className="py-4 px-4 text-center font-bold text-amber-500">{doc.averageRating} ★</td>
                  <td className="py-4 px-4 text-right">
                    <button
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
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-slate-200 text-slate-500 hover:border-primary/50"
                      }`}
                    >
                      {spec.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setDoctorModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-505 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer">Register Doctor</button>
            </div>
          </form>
        </CustomModal>
      </div>
    );
  }

  if (activeTab === "admin-users") {
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
                  <td className="py-4 px-4 text-slate-505">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-750"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={u.status}
                      onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                      className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
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

  if (activeTab === "admin-audit") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinic Appointment & Billing Auditing</h2>
          <p className="text-xs text-slate-400 mt-1">Audit billing transactions, verify payment transaction IDs, and update appointment states manually.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4">Patient Name</th>
                <th className="py-4 px-4">Doctor Name</th>
                <th className="py-4 px-4">Stripe Txn ID</th>
                <th className="py-4 px-4 text-center">Fare Amount</th>
                <th className="py-4 px-4 text-center">Billing</th>
                <th className="py-4 px-4 text-center">Visit Status</th>
                <th className="py-4 px-4 text-right">Manage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
              {appointments.map(appt => (
                <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{appt.patient.name}</td>
                  <td className="py-4 px-4 text-slate-550">{appt.doctor.name}</td>
                  <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{appt.payment?.transactionId || "N/A"}</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">৳{appt.doctor.appointmentFee}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      appt.paymentStatus === PaymentStatus.PAID ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {appt.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      appt.status === AppointmentStatus.COMPLETED ? "bg-slate-100 text-slate-650" :
                      appt.status === AppointmentStatus.CANCELED ? "bg-red-150 text-red-750" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={appt.status}
                      onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)}
                      className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      {Object.values(AppointmentStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
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

  return null;
}
