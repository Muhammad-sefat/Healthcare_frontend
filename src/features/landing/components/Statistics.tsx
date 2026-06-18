import React from "react";
import { Award, UserCheck, Video, Clock } from "lucide-react";

export function Statistics() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white">100+</div>
            <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Certified Doctors</div>
          </div>
          <div className="space-y-2">
            <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white">10K+</div>
            <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Registered Patients</div>
          </div>
          <div className="space-y-2">
            <Video className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white">50K+</div>
            <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Consultations Done</div>
          </div>
          <div className="space-y-2">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Support Operations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
