export interface Specialty {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface SpecialtiesResponse {
  success: boolean;
  message: string;
  data: Specialty[];
}
