import React from "react";
import { Search, UserCheck, Video, FileText } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Find a Doctor",
      desc: "Search by specialty, location, or name to find the right medical provider."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: "Book Appointment",
      desc: "Select a convenient time slot from the doctor's claimed availability calendar."
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Video Consultation",
      desc: "Conduct safe, high-definition online video sessions from your dashboard."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Get Prescription",
      desc: "Receive digital clinical guidelines, prescriptions, and pdf downloads instantly."
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How CarePulse Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Four easy steps to connect with trusted clinical assistance. Our flow ensures rapid feedback and complete medical audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative group text-center space-y-4">
              <div className="mx-auto h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shadow-xs border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
              {index < 3 && (
                <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-700 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
