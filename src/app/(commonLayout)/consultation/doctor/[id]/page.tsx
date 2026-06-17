import { redirect } from "next/navigation";
import { use } from "react";

export default function ConsultationDoctorRedirectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  redirect(`/doctors/${id}`);
}

