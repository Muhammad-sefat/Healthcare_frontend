export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum BloodGroup {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE"
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID"
}

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  needsPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  title: string;
  description: string;
  icon: string;
  isDeleted: boolean;
}

export interface DoctorSpecialty {
  id: string;
  specialtyId: string;
  specialty: Specialty;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkplace: string;
  designation: string;
  averageRating: number;
  isDeleted: boolean;
  specialties: DoctorSpecialty[];
}

export interface PatientHealthData {
  id: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height: string;
  weight: string;
  smokingStatus: boolean;
  dietaryPreferences: string;
  pregnancyStatus: boolean;
  mentalHealthHistory: string;
  immunizationStatus: string;
  hasPastSurgeries: boolean;
  recentAnxiety: boolean;
  recentDepression: boolean;
  maritalStatus: string;
}

export interface MedicalReport {
  id: string;
  reportName: string;
  reportLink: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  patientHealthData?: PatientHealthData;
  medicalReports?: MedicalReport[];
}

export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  isBooked?: boolean;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  scheduleId: string;
  schedule: Schedule;
  isBooked: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  doctorId: string;
  doctor: {
    name: string;
    appointmentFee: number;
  };
  patientId: string;
  patient: {
    name: string;
    email: string;
  };
  scheduleId: string;
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
  payment?: Payment;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  instructions: string;
  followUpDate: string;
  createdAt: string;
  doctor: {
    name: string;
  };
  patient: {
    name: string;
  };
  pdfUrl?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient: {
    name: string;
    profilePhoto?: string;
  };
  doctorId: string;
  doctor: {
    name: string;
  };
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber: string;
}
