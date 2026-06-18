"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Role, 
  UserStatus, 
  Gender, 
  BloodGroup, 
  AppointmentStatus, 
  PaymentStatus, 
  Doctor, 
  Patient, 
  Appointment, 
  Prescription, 
  Review, 
  Specialty, 
  Schedule,
  Admin,
  User,
  PatientHealthData
} from "@/types";
import { 
  mockDoctors, 
  mockPatient, 
  mockAppointments, 
  mockPrescriptions, 
  mockReviews, 
  mockSpecialties, 
  mockSystemSchedules, 
  mockAdmins,
  mockUsers,
  mockDoctorSchedules 
} from "@/constants/mockData";

interface AuthContextType {
  currentUser: User | null;
  activeRole: Role | null;
  currentProfile: Patient | Doctor | Admin | null;
  users: typeof mockUsers;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  specialties: Specialty[];
  schedules: Schedule[];
  prescriptions: Prescription[];
  reviews: Review[];
  admins: Admin[];
  needsPasswordChange: boolean;
  
  // Auth Functions
  login: (email: string, role: Role) => boolean;
  register: (name: string, email: string) => void;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => void;
  switchRole: (role: Role) => void;

  // Actions
  updatePatientProfile: (profile: Partial<Patient>, healthData: Partial<PatientHealthData>) => void;
  uploadMedicalReport: (fileName: string) => void;
  deleteMedicalReport: (reportId: string) => void;
  
  claimSlot: (scheduleId: string) => void;
  releaseSlot: (scheduleId: string) => void;
  
  bookAppointment: (doctorId: string, scheduleId: string, payNow: boolean) => void;
  cancelAppointment: (appointmentId: string) => void;
  initiatePayment: (appointmentId: string) => void;
  addReview: (appointmentId: string, rating: number, comment: string) => void;

  // Doctor actions
  startConsultation: (appointmentId: string) => void;
  completeAppointment: (appointmentId: string) => void;
  writePrescription: (appointmentId: string, instructions: string, followUpDate: string) => void;

  // Admin actions
  addSpecialty: (title: string, description: string, icon: string) => void;
  deleteSpecialty: (specialtyId: string) => void;
  generateSchedules: (startDate: string, endDate: string, startTime: string, endTime: string) => void;
  registerDoctor: (doctor: Omit<Doctor, "id" | "averageRating" | "isDeleted" | "specialties">, specialtyIds: string[]) => void;
  updateDoctor: (id: string, updatedFields: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  changeUserStatus: (userId: string, status: UserStatus) => void;
  changeUserRole: (userId: string, role: Role) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  // Super Admin actions
  createAdmin: (name: string, email: string, contactNumber: string, role: Role) => void;
  deleteAdmin: (adminId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database state stored in local state for reactive updates during demo session
  const [users, setUsers] = useState<typeof mockUsers>(mockUsers);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients, setPatients] = useState<Patient[]>([mockPatient]);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [specialties, setSpecialties] = useState<Specialty[]>(mockSpecialties);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSystemSchedules);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);

  // Authentication status
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Patient | Doctor | Admin | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

  // Auto-login to Patient role initially to make standard dashboard review easy
  useEffect(() => {
    login("johndoe@gmail.com", Role.PATIENT);
  }, []);

  function login(email: string, role: Role): boolean {
    // Find matching user or fallback
    const existingUser = users.find(u => u.email === email && u.role === role);
    
    let mockUserObj: User;
    if (existingUser) {
      mockUserObj = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        status: existingUser.status as UserStatus,
        needsPasswordChange: existingUser.needsPasswordChange,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt
      };
    } else {
      // Create dynamically if not found
      mockUserObj = {
        id: `user-${role.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        email,
        role,
        status: UserStatus.ACTIVE,
        needsPasswordChange: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, {
        ...mockUserObj,
        needsPasswordChange: false
      }]);
    }

    if (mockUserObj.status === UserStatus.BLOCKED) {
      return false; // Cannot log in if blocked
    }

    setCurrentUser(mockUserObj);
    setActiveRole(role);
    setNeedsPasswordChange(mockUserObj.needsPasswordChange);

    // Fetch corresponding profile
    if (role === Role.PATIENT) {
      const pat = patients.find(p => p.email === email) || patients[0];
      setCurrentProfile(pat);
    } else if (role === Role.DOCTOR) {
      const doc = doctors.find(d => d.email === email) || doctors[0];
      setCurrentProfile(doc);
    } else {
      const adm = admins.find(a => a.email === email) || admins[0];
      setCurrentProfile(adm);
    }

    return true;
  }

  const register = (name: string, email: string) => {
    const patientId = `patient-uuid-${Math.floor(Math.random() * 1000)}`;
    const newPatient: Patient = {
      id: patientId,
      name,
      email,
      contactNumber: "",
      address: "",
      isDeleted: false,
      patientHealthData: {
        id: `health-uuid-${Math.floor(Math.random() * 1000)}`,
        gender: Gender.MALE,
        dateOfBirth: new Date().toISOString(),
        bloodGroup: BloodGroup.O_POSITIVE,
        hasAllergies: false,
        hasDiabetes: false,
        height: "5 feet 8 inches",
        weight: "70 kg",
        smokingStatus: false,
        dietaryPreferences: "None",
        pregnancyStatus: false,
        mentalHealthHistory: "",
        immunizationStatus: "None",
        hasPastSurgeries: false,
        recentAnxiety: false,
        recentDepression: false,
        maritalStatus: "Single"
      },
      medicalReports: []
    };

    setPatients(prev => [...prev, newPatient]);
    
    // Add to User list
    const newUser = {
      id: `user-patient-${Math.floor(Math.random() * 1000)}`,
      email,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      needsPasswordChange: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    
    // Auto login as new Patient
    setCurrentUser(newUser);
    setActiveRole(Role.PATIENT);
    setCurrentProfile(newPatient);
    setNeedsPasswordChange(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole(null);
    setCurrentProfile(null);
    setNeedsPasswordChange(false);
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (currentUser) {
      setNeedsPasswordChange(false);
      setCurrentUser(prev => prev ? { ...prev, needsPasswordChange: false } : null);
      setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, needsPasswordChange: false } : u));
    }
  };

  const switchRole = (role: Role) => {
    // Switch active role instantly for development review
    setActiveRole(role);
    if (role === Role.PATIENT) {
      const pat = patients[0];
      setCurrentProfile(pat);
      setCurrentUser(prev => prev ? { ...prev, email: pat.email, role: Role.PATIENT } : null);
    } else if (role === Role.DOCTOR) {
      const doc = doctors[0];
      setCurrentProfile(doc);
      setCurrentUser(prev => prev ? { ...prev, email: doc.email, role: Role.DOCTOR } : null);
    } else if (role === Role.ADMIN) {
      const adm = admins.find(a => a.email.includes("admin.alex")) || admins[0];
      setCurrentProfile(adm);
      setCurrentUser(prev => prev ? { ...prev, email: adm.email, role: Role.ADMIN } : null);
    } else if (role === Role.SUPER_ADMIN) {
      const adm = admins.find(a => a.email.includes("super.sefat")) || admins[1] || admins[0];
      setCurrentProfile(adm);
      setCurrentUser(prev => prev ? { ...prev, email: adm.email, role: Role.SUPER_ADMIN } : null);
    }
  };

  // ----------------------------------------------------
  // Patients Actions
  // ----------------------------------------------------
  const updatePatientProfile = (profile: Partial<Patient>, healthData: Partial<PatientHealthData>) => {
    setPatients(prev => prev.map(p => {
      if (p.id === currentProfile?.id) {
        const updated = {
          ...p,
          ...profile,
          patientHealthData: {
            ...p.patientHealthData,
            ...healthData
          }
        } as Patient;
        setCurrentProfile(updated);
        return updated;
      }
      return p;
    }));
  };

  const uploadMedicalReport = (fileName: string) => {
    if (activeRole !== Role.PATIENT) return;
    setPatients(prev => prev.map(p => {
      if (p.id === currentProfile?.id) {
        const newReports = [
          ...(p.medicalReports || []),
          {
            id: `rep-uuid-${Math.floor(Math.random() * 1000)}`,
            reportName: fileName,
            reportLink: "#"
          }
        ];
        const updated = { ...p, medicalReports: newReports };
        setCurrentProfile(updated);
        return updated;
      }
      return p;
    }));
  };

  const deleteMedicalReport = (reportId: string) => {
    if (activeRole !== Role.PATIENT) return;
    setPatients(prev => prev.map(p => {
      if (p.id === currentProfile?.id) {
        const newReports = (p.medicalReports || []).filter(r => r.id !== reportId);
        const updated = { ...p, medicalReports: newReports };
        setCurrentProfile(updated);
        return updated;
      }
      return p;
    }));
  };

  // ----------------------------------------------------
  // Doctor Schedule Slots Assignment
  // ----------------------------------------------------
  const claimSlot = (scheduleId: string) => {
    if (activeRole !== Role.DOCTOR) return;
    // Mark as claimed by creating a link (simulate this by marking schedule as claimed, or mapping it)
    // For simplicity, we can let schedules hold doctor assignments
    setSchedules(prev => prev.map(s => {
      if (s.id === scheduleId) {
        return { ...s, isBooked: false }; // claimed, not booked by patient yet
      }
      return s;
    }));
    
    // Add to mock doctor schedules link
    const exists = mockDoctorSchedules.some(ds => ds.scheduleId === scheduleId && ds.doctorId === currentProfile?.id);
    if (!exists) {
      mockDoctorSchedules.push({
        id: `doc-sched-${Math.floor(Math.random() * 1000)}`,
        doctorId: currentProfile?.id || "",
        scheduleId,
        isBooked: false
      });
    }
  };

  const releaseSlot = (scheduleId: string) => {
    if (activeRole !== Role.DOCTOR) return;
    // Remove claim
    const index = mockDoctorSchedules.findIndex(ds => ds.scheduleId === scheduleId && ds.doctorId === currentProfile?.id && !ds.isBooked);
    if (index !== -1) {
      mockDoctorSchedules.splice(index, 1);
    }
  };

  // ----------------------------------------------------
  // Appointment Booking & Payment
  // ----------------------------------------------------
  const bookAppointment = (doctorId: string, scheduleId: string, payNow: boolean) => {
    const selectedDoc = doctors.find(d => d.id === doctorId);
    const selectedSched = schedules.find(s => s.id === scheduleId);
    if (!selectedDoc || !selectedSched) return;

    // Mark schedule as booked
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, isBooked: true } : s));
    
    // Mark doctor schedule link as booked
    const docSched = mockDoctorSchedules.find(ds => ds.scheduleId === scheduleId && ds.doctorId === doctorId);
    if (docSched) docSched.isBooked = true;

    const newAppointment: Appointment = {
      id: `appt-uuid-${Math.floor(Math.random() * 1000)}`,
      videoCallingId: `video-call-${Math.floor(Math.random() * 1000000)}`,
      status: AppointmentStatus.SCHEDULED,
      paymentStatus: payNow ? PaymentStatus.PAID : PaymentStatus.UNPAID,
      createdAt: new Date().toISOString(),
      doctorId,
      doctor: {
        name: selectedDoc.name,
        appointmentFee: selectedDoc.appointmentFee
      },
      patientId: currentProfile?.id || "patient-uuid-1",
      patient: {
        name: currentProfile?.name || "John Doe",
        email: currentProfile?.email || "johndoe@gmail.com"
      },
      scheduleId,
      schedule: {
        id: scheduleId,
        startDateTime: selectedSched.startDateTime,
        endDateTime: selectedSched.endDateTime
      },
      payment: payNow ? {
        id: `pay-uuid-${Math.floor(Math.random() * 1000)}`,
        amount: selectedDoc.appointmentFee,
        transactionId: `stripe_txn_${Math.floor(Math.random() * 1000000)}`,
        status: PaymentStatus.PAID
      } : undefined
    };

    setAppointments(prev => [newAppointment, ...prev]);
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === appointmentId) {
        // Release schedule
        setSchedules(sPrev => sPrev.map(s => s.id === appt.scheduleId ? { ...s, isBooked: false } : s));
        const docSched = mockDoctorSchedules.find(ds => ds.scheduleId === appt.scheduleId && ds.doctorId === appt.doctorId);
        if (docSched) docSched.isBooked = false;
        
        return { ...appt, status: AppointmentStatus.CANCELED };
      }
      return appt;
    }));
  };

  const initiatePayment = (appointmentId: string) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === appointmentId) {
        return {
          ...appt,
          paymentStatus: PaymentStatus.PAID,
          payment: {
            id: `pay-uuid-${Math.floor(Math.random() * 1000)}`,
            amount: appt.doctor.appointmentFee,
            transactionId: `stripe_txn_${Math.floor(Math.random() * 1000000)}`,
            status: PaymentStatus.PAID
          }
        };
      }
      return appt;
    }));
  };

  const addReview = (appointmentId: string, rating: number, comment: string) => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;

    const newReview: Review = {
      id: `rev-uuid-${Math.floor(Math.random() * 1000)}`,
      appointmentId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      patient: {
        name: appt.patient.name,
        profilePhoto: currentProfile?.profilePhoto
      },
      doctorId: appt.doctorId,
      doctor: {
        name: appt.doctor.name
      }
    };

    setReviews(prev => [newReview, ...prev]);
  };

  // ----------------------------------------------------
  // Doctor Consultation
  // ----------------------------------------------------
  const startConsultation = (appointmentId: string) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === appointmentId) {
        return { ...appt, status: AppointmentStatus.INPROGRESS };
      }
      return appt;
    }));
  };

  const completeAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === appointmentId) {
        return { ...appt, status: AppointmentStatus.COMPLETED };
      }
      return appt;
    }));
  };

  const writePrescription = (appointmentId: string, instructions: string, followUpDate: string) => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;

    const newPrescription: Prescription = {
      id: `presc-uuid-${Math.floor(Math.random() * 1000)}`,
      appointmentId,
      instructions,
      followUpDate,
      createdAt: new Date().toISOString(),
      doctor: {
        name: appt.doctor.name
      },
      patient: {
        name: appt.patient.name
      },
      pdfUrl: "#"
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    // Also mark appointment completed
    completeAppointment(appointmentId);
  };

  // ----------------------------------------------------
  // Admin Operations
  // ----------------------------------------------------
  const addSpecialty = (title: string, description: string, icon: string) => {
    const newSpecialty: Specialty = {
      id: `spec-uuid-${Math.floor(Math.random() * 1000)}`,
      title,
      description,
      icon: icon || "https://img.icons8.com/color/96/health.png",
      isDeleted: false
    };
    setSpecialties(prev => [...prev, newSpecialty]);
  };

  const deleteSpecialty = (specialtyId: string) => {
    setSpecialties(prev => prev.filter(s => s.id !== specialtyId));
  };

  const generateSchedules = (startDate: string, endDate: string, startTime: string, endTime: string) => {
    // Generates 30-min schedule blocks daily
    const startD = new Date(startDate);
    const endD = new Date(endDate);
    const generated: Schedule[] = [];

    // Simple slot generation logic
    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);

      const dayStart = new Date(d);
      dayStart.setHours(startH, startM, 0, 0);

      const dayEnd = new Date(d);
      dayEnd.setHours(endH, endM, 0, 0);

      let slotTime = new Date(dayStart);
      while (slotTime < dayEnd) {
        const nextTime = new Date(slotTime.getTime() + 30 * 60 * 1000);
        generated.push({
          id: `sched-uuid-${Math.floor(Math.random() * 100000)}`,
          startDateTime: slotTime.toISOString(),
          endDateTime: nextTime.toISOString(),
          isBooked: false
        });
        slotTime = nextTime;
      }
    }

    setSchedules(prev => [...prev, ...generated]);
  };

  const registerDoctor = (doctor: Omit<Doctor, "id" | "averageRating" | "isDeleted" | "specialties">, specialtyIds: string[]) => {
    const newDocId = `doc-uuid-${Math.floor(Math.random() * 1000)}`;
    const newDoc: Doctor = {
      ...doctor,
      id: newDocId,
      averageRating: 5.0,
      isDeleted: false,
      specialties: specialtyIds.map((sid, idx) => ({
        id: `ds-dyn-${idx}-${Math.floor(Math.random() * 100)}`,
        specialtyId: sid,
        specialty: specialties.find(s => s.id === sid) || specialties[0]
      }))
    };

    setDoctors(prev => [...prev, newDoc]);
    
    // Add User account
    const newDocUser = {
      id: `user-doc-${Math.floor(Math.random() * 1000)}`,
      email: doctor.email,
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
      needsPasswordChange: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newDocUser]);
  };

  const updateDoctor = (id: string, updatedFields: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, isDeleted: true } : d));
  };

  const changeUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    
    // If the blocked user is current, force logout
    if (currentUser && users.find(u => u.id === userId)?.email === currentUser.email && status === UserStatus.BLOCKED) {
      logout();
    }
  };

  const changeUserRole = (userId: string, role: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status } : appt));
  };

  // ----------------------------------------------------
  // Super Admin Operations
  // ----------------------------------------------------
  const createAdmin = (name: string, email: string, contactNumber: string, role: Role) => {
    const newAdmin: Admin = {
      id: `admin-uuid-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      contactNumber
    };
    setAdmins(prev => [...prev, newAdmin]);

    // Create User record
    const newAdminUser = {
      id: `user-admin-${Math.floor(Math.random() * 1000)}`,
      email,
      role,
      status: UserStatus.ACTIVE,
      needsPasswordChange: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newAdminUser]);
  };

  const deleteAdmin = (adminId: string) => {
    setAdmins(prev => prev.filter(a => a.id !== adminId));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      activeRole,
      currentProfile,
      users,
      doctors,
      patients,
      appointments,
      specialties,
      schedules,
      prescriptions,
      reviews,
      admins,
      needsPasswordChange,
      login,
      register,
      logout,
      changePassword,
      switchRole,
      updatePatientProfile,
      uploadMedicalReport,
      deleteMedicalReport,
      claimSlot,
      releaseSlot,
      bookAppointment,
      cancelAppointment,
      initiatePayment,
      addReview,
      startConsultation,
      completeAppointment,
      writePrescription,
      addSpecialty,
      deleteSpecialty,
      generateSchedules,
      registerDoctor,
      updateDoctor,
      deleteDoctor,
      changeUserStatus,
      changeUserRole,
      updateAppointmentStatus,
      createAdmin,
      deleteAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
