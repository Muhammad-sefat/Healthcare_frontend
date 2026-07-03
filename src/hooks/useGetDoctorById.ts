import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface DoctorDetailData {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: string;
  appointmentFee: number;
  qualification: string;
  currentWorkplace: string;
  designation: string;
  averageRating: number;
  specialties: Array<{
    id: string;
    doctorId: string;
    specialtyId: string;
    specialty: {
      id: string;
      title: string;
      description: string;
      image: string;
    };
  }>;
  doctorSchedules: Array<{
    doctorId: string;
    scheduleId: string;
    isBooked: boolean;
    schedule: {
      id: string;
      startDateTime: string;
      endDateTime: string;
    };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    patient: {
      name: string;
      profilePhoto?: string;
    };
  }>;
}

export interface DoctorDetailResponse {
  success: boolean;
  message: string;
  data: DoctorDetailData;
}

export const getDoctorById = async (id: string): Promise<DoctorDetailResponse> => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export function useGetDoctorById(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    enabled: !!id,
  });
}
