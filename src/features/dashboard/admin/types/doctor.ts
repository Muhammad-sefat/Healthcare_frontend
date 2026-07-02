export interface CreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: "MALE" | "FEMALE";
    appointmentFee: number;
    qualification: string;
    currentWorkplace: string;
    designation: string;
  };
  specialties: string[];
  image?: File | null;
}
