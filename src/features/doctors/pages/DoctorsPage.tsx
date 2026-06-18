import React, { Suspense } from "react";
import { DoctorsListView } from "../components/DoctorsListView";

export function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    }>
      <DoctorsListView />
    </Suspense>
  );
}
export default DoctorsPage;
