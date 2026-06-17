import { 
  Specialty, 
  Doctor, 
  Patient, 
  Appointment, 
  Prescription, 
  Review, 
  Admin, 
  Gender, 
  BloodGroup, 
  AppointmentStatus, 
  PaymentStatus,
  Role,
  UserStatus,
  Schedule
} from "@/types";

export const mockSpecialties: Specialty[] = [
  {
    id: "spec-uuid-cardio",
    title: "Cardiology",
    description: "Heart care, blood pressure, and cardiovascular treatment.",
    icon: "https://img.icons8.com/color/96/heart.png",
    isDeleted: false
  },
  {
    id: "spec-uuid-neuro",
    title: "Neurology",
    description: "Brain, spine, nervous system disorders and surgeries.",
    icon: "https://img.icons8.com/color/96/brain.png",
    isDeleted: false
  },
  {
    id: "spec-uuid-peds",
    title: "Pediatrics",
    description: "Child health, growth, immunizations, and developmental care.",
    icon: "https://img.icons8.com/color/96/children.png",
    isDeleted: false
  },
  {
    id: "spec-uuid-ortho",
    title: "Orthopedics",
    description: "Bone, joints, ligaments, muscles, and fracture treatment.",
    icon: "https://img.icons8.com/color/96/spine.png",
    isDeleted: false
  },
  {
    id: "spec-uuid-derm",
    title: "Dermatology",
    description: "Skin, hair, nails, acne, eczema, and skin cancer care.",
    icon: "https://img.icons8.com/color/96/skin.png",
    isDeleted: false
  },
  {
    id: "spec-uuid-gyn",
    title: "Gynecology",
    description: "Women's reproductive health, pregnancy, and childbirth.",
    icon: "https://img.icons8.com/color/96/pregnant-woman.png",
    isDeleted: false
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: "doc-uuid-1",
    name: "Dr. Sarah Jenkins",
    email: "sarah.j@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01712345678",
    address: "Dhaka Medical College, Dhaka",
    registrationNumber: "DMC-98726",
    experience: 12,
    gender: Gender.FEMALE,
    appointmentFee: 1000,
    qualification: "MBBS, MD (Cardiology)",
    currentWorkplace: "National Heart Foundation",
    designation: "Senior Consultant",
    averageRating: 4.8,
    isDeleted: false,
    specialties: [
      {
        id: "ds-1",
        specialtyId: "spec-uuid-cardio",
        specialty: mockSpecialties[0]
      }
    ]
  },
  {
    id: "doc-uuid-2",
    name: "Dr. James Carter",
    email: "james.c@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01712345679",
    address: "Square Hospital, Panthapath, Dhaka",
    registrationNumber: "DMC-87654",
    experience: 15,
    gender: Gender.MALE,
    appointmentFee: 1500,
    qualification: "MBBS, FCPS (Neurology)",
    currentWorkplace: "National Institute of Neurosciences",
    designation: "Professor",
    averageRating: 4.9,
    isDeleted: false,
    specialties: [
      {
        id: "ds-2",
        specialtyId: "spec-uuid-neuro",
        specialty: mockSpecialties[1]
      }
    ]
  },
  {
    id: "doc-uuid-3",
    name: "Dr. Emily Stone",
    email: "emily.s@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01712345680",
    address: "Evercare Hospital, Bashundhara, Dhaka",
    registrationNumber: "DMC-76543",
    experience: 8,
    gender: Gender.FEMALE,
    appointmentFee: 800,
    qualification: "MBBS, DCH (Pediatrics)",
    currentWorkplace: "Dhaka Shishu Hospital",
    designation: "Associate Professor",
    averageRating: 4.6,
    isDeleted: false,
    specialties: [
      {
        id: "ds-3",
        specialtyId: "spec-uuid-peds",
        specialty: mockSpecialties[2]
      }
    ]
  },
  {
    id: "doc-uuid-4",
    name: "Dr. Richard Alpert",
    email: "richard.a@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01712345681",
    address: "Labaid Specialized Hospital, Dhanmondi, Dhaka",
    registrationNumber: "DMC-54321",
    experience: 20,
    gender: Gender.MALE,
    appointmentFee: 1200,
    qualification: "MBBS, MS (Orthopedics)",
    currentWorkplace: "NITOR (Pangu Hospital)",
    designation: "Chief Consultant & Surgeon",
    averageRating: 4.7,
    isDeleted: false,
    specialties: [
      {
        id: "ds-4",
        specialtyId: "spec-uuid-ortho",
        specialty: mockSpecialties[3]
      }
    ]
  }
];

export const mockPatient: Patient = {
  id: "patient-uuid-1",
  name: "John Doe",
  email: "johndoe@gmail.com",
  profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
  contactNumber: "01911223344",
  address: "House 12, Road 5, Dhanmondi, Dhaka",
  isDeleted: false,
  patientHealthData: {
    id: "health-uuid-1",
    gender: Gender.MALE,
    dateOfBirth: "1994-04-12T00:00:00.000Z",
    bloodGroup: BloodGroup.O_POSITIVE,
    hasAllergies: true,
    hasDiabetes: false,
    height: "5 feet 9 inches",
    weight: "74 kg",
    smokingStatus: false,
    dietaryPreferences: "Vegetarian",
    pregnancyStatus: false,
    mentalHealthHistory: "None",
    immunizationStatus: "Fully Vaccinated",
    hasPastSurgeries: false,
    recentAnxiety: false,
    recentDepression: false,
    maritalStatus: "Single"
  },
  medicalReports: [
    {
      id: "rep-uuid-1",
      reportName: "CBC Blood Report.pdf",
      reportLink: "https://example.com/reports/blood-report.pdf"
    },
    {
      id: "rep-uuid-2",
      reportName: "Chest X-Ray.pdf",
      reportLink: "https://example.com/reports/chest-xray.pdf"
    }
  ]
};

export const mockSystemSchedules: Schedule[] = [
  { id: "sched-uuid-1", startDateTime: "2026-06-20T09:00:00.000Z", endDateTime: "2026-06-20T09:30:00.000Z", isBooked: false },
  { id: "sched-uuid-2", startDateTime: "2026-06-20T09:30:00.000Z", endDateTime: "2026-06-20T10:00:00.000Z", isBooked: false },
  { id: "sched-uuid-3", startDateTime: "2026-06-20T10:00:00.000Z", endDateTime: "2026-06-20T10:30:00.000Z", isBooked: false },
  { id: "sched-uuid-4", startDateTime: "2026-06-20T10:30:00.000Z", endDateTime: "2026-06-20T11:00:00.000Z", isBooked: false },
  { id: "sched-uuid-5", startDateTime: "2026-06-20T11:00:00.000Z", endDateTime: "2026-06-20T11:30:00.000Z", isBooked: false },
  { id: "sched-uuid-6", startDateTime: "2026-06-20T11:30:00.000Z", endDateTime: "2026-06-20T12:00:00.000Z", isBooked: false },
  { id: "sched-uuid-7", startDateTime: "2026-06-20T14:00:00.000Z", endDateTime: "2026-06-20T14:30:00.000Z", isBooked: false },
  { id: "sched-uuid-8", startDateTime: "2026-06-20T14:30:00.000Z", endDateTime: "2026-06-20T15:00:00.000Z", isBooked: false },
  
  { id: "sched-uuid-9", startDateTime: "2026-06-21T09:00:00.000Z", endDateTime: "2026-06-21T09:30:00.000Z", isBooked: false },
  { id: "sched-uuid-10", startDateTime: "2026-06-21T09:30:00.000Z", endDateTime: "2026-06-21T10:00:00.000Z", isBooked: false },
  { id: "sched-uuid-11", startDateTime: "2026-06-21T10:00:00.000Z", endDateTime: "2026-06-21T10:30:00.000Z", isBooked: false },
  { id: "sched-uuid-12", startDateTime: "2026-06-21T10:30:00.000Z", endDateTime: "2026-06-21T11:00:00.000Z", isBooked: false }
];

export const mockDoctorSchedules = [
  { id: "doc-sched-1", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-1", isBooked: true },
  { id: "doc-sched-2", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-2", isBooked: false },
  { id: "doc-sched-3", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-3", isBooked: false },
  { id: "doc-sched-4", doctorId: "doc-uuid-1", scheduleId: "sched-uuid-4", isBooked: false },
  
  { id: "doc-sched-5", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-5", isBooked: false },
  { id: "doc-sched-6", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-6", isBooked: false },
  { id: "doc-sched-7", doctorId: "doc-uuid-2", scheduleId: "sched-uuid-7", isBooked: false }
];

export const mockAppointments: Appointment[] = [
  {
    id: "appt-uuid-1",
    videoCallingId: "87fa281a-cb55-46c9-b7b5-22b04f14188b",
    status: AppointmentStatus.SCHEDULED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: "2026-06-15T10:00:00.000Z",
    doctorId: "doc-uuid-1",
    doctor: {
      name: "Dr. Sarah Jenkins",
      appointmentFee: 1000
    },
    patientId: "patient-uuid-1",
    patient: {
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    scheduleId: "sched-uuid-1",
    schedule: {
      id: "sched-uuid-1",
      startDateTime: "2026-06-20T09:30:00.000Z",
      endDateTime: "2026-06-20T10:00:00.000Z"
    },
    payment: {
      id: "pay-uuid-1",
      amount: 1000,
      transactionId: "50e4b857-e62a-4318-971c-4b53faee73df",
      status: PaymentStatus.PAID
    }
  },
  {
    id: "appt-uuid-2",
    videoCallingId: "b80f745e-6e2c-47bc-980b-df2a2cc14352",
    status: AppointmentStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: "2026-06-12T08:30:00.000Z",
    doctorId: "doc-uuid-1",
    doctor: {
      name: "Dr. Sarah Jenkins",
      appointmentFee: 1000
    },
    patientId: "patient-uuid-1",
    patient: {
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    scheduleId: "sched-uuid-2",
    schedule: {
      id: "sched-uuid-2",
      startDateTime: "2026-06-14T11:00:00.000Z",
      endDateTime: "2026-06-14T11:30:00.000Z"
    },
    payment: {
      id: "pay-uuid-2",
      amount: 1000,
      transactionId: "pay_stripe_987654",
      status: PaymentStatus.PAID
    }
  },
  {
    id: "appt-uuid-3",
    videoCallingId: "3df985cc-c764-42b7-a365-51fa0ef0d19c",
    status: AppointmentStatus.CANCELED,
    paymentStatus: PaymentStatus.UNPAID,
    createdAt: "2026-06-14T15:00:00.000Z",
    doctorId: "doc-uuid-2",
    doctor: {
      name: "Dr. James Carter",
      appointmentFee: 1500
    },
    patientId: "patient-uuid-1",
    patient: {
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    scheduleId: "sched-uuid-8",
    schedule: {
      id: "sched-uuid-8",
      startDateTime: "2026-06-19T14:30:00.000Z",
      endDateTime: "2026-06-19T15:00:00.000Z"
    }
  },
  {
    id: "appt-uuid-4",
    videoCallingId: "f9d34208-1122-44cc-88ee-123456789abc",
    status: AppointmentStatus.SCHEDULED,
    paymentStatus: PaymentStatus.UNPAID,
    createdAt: "2026-06-16T12:00:00.000Z",
    doctorId: "doc-uuid-2",
    doctor: {
      name: "Dr. James Carter",
      appointmentFee: 1500
    },
    patientId: "patient-uuid-1",
    patient: {
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    scheduleId: "sched-uuid-5",
    schedule: {
      id: "sched-uuid-5",
      startDateTime: "2026-06-22T11:00:00.000Z",
      endDateTime: "2026-06-22T11:30:00.000Z"
    }
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: "presc-uuid-1",
    appointmentId: "appt-uuid-2",
    instructions: "Tab. Napa Extend (665mg) - 1 + 0 + 1 after food for 5 days. Tab. Fexo 120mg - 0 + 0 + 1 before food for 10 days. Avoid cold foods.",
    followUpDate: "2026-06-25",
    createdAt: "2026-06-14T11:30:00.000Z",
    doctor: {
      name: "Dr. Sarah Jenkins"
    },
    patient: {
      name: "John Doe"
    },
    pdfUrl: "https://example.com/reports/presc-uuid-1.pdf"
  }
];

export const mockReviews: Review[] = [
  {
    id: "rev-uuid-1",
    appointmentId: "appt-uuid-2",
    rating: 5,
    comment: "Dr. Sarah was extremely patient and listened to my symptoms carefully. Excellent care!",
    createdAt: "2026-06-14T12:00:00.000Z",
    patient: {
      name: "John Doe",
      profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"
    },
    doctorId: "doc-uuid-1",
    doctor: {
      name: "Dr. Sarah Jenkins"
    }
  },
  {
    id: "rev-uuid-2",
    appointmentId: "appt-uuid-prev",
    rating: 4,
    comment: "Great consultation. Understood my health history very well.",
    createdAt: "2026-06-10T10:00:00.000Z",
    patient: {
      name: "Jane Smith",
      profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
    },
    doctorId: "doc-uuid-1",
    doctor: {
      name: "Dr. Sarah Jenkins"
    }
  }
];

export const mockAdmins: Admin[] = [
  {
    id: "admin-uuid-1",
    name: "Alex Vance",
    email: "admin.alex@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01887766554"
  },
  {
    id: "superadmin-uuid-1",
    name: "Sefat Super",
    email: "super.sefat@clinic.com",
    profilePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    contactNumber: "01700112233"
  }
];

export const mockUsers = [
  {
    id: "user-patient-1",
    email: "johndoe@gmail.com",
    role: Role.PATIENT,
    status: UserStatus.ACTIVE,
    needsPasswordChange: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-doctor-1",
    email: "sarah.j@clinic.com",
    role: Role.DOCTOR,
    status: UserStatus.ACTIVE,
    needsPasswordChange: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-admin-1",
    email: "admin.alex@clinic.com",
    role: Role.ADMIN,
    status: UserStatus.ACTIVE,
    needsPasswordChange: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-super-1",
    email: "super.sefat@clinic.com",
    role: Role.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    needsPasswordChange: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];

export const mockPatientStats = {
  appointmentCount: 5,
  reviewCount: 2,
  appointmentStatusDistribution: [
    { status: "COMPLETED", count: 3 },
    { status: "SCHEDULED", count: 1 },
    { status: "CANCELED", count: 1 }
  ]
};

export const mockDoctorStats = {
  reviewCount: 18,
  patientCount: 35,
  appointmentCount: 42,
  totalRevenue: 42000,
  appointmentStatusDistribution: [
    { status: "COMPLETED", count: 30 },
    { status: "SCHEDULED", count: 8 },
    { status: "CANCELED", count: 4 }
  ]
};

export const mockAdminStats = {
  appointmentCount: 184,
  doctorCount: 15,
  patientCount: 94,
  paymentCount: 184,
  userCount: 112,
  adminCount: 3,
  totalRevenue: 178000,
  pieChartData: [
    { status: "COMPLETED", count: 120 },
    { status: "SCHEDULED", count: 40 },
    { status: "CANCELED", count: 24 }
  ],
  barChartData: [
    { month: "Jan", count: 20 },
    { month: "Feb", count: 25 },
    { month: "Mar", count: 32 },
    { month: "Apr", count: 38 },
    { month: "May", count: 42 },
    { month: "Jun", count: 27 }
  ]
};
