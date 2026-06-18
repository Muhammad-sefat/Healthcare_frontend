"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Send
} from "lucide-react";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    // Console log payload as requested
    console.log("Contact Form Submitted Payload:", data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    reset();
  };

  const contactCards = [
    {
      icon: <PhoneCall className="h-5 w-5 text-primary" />,
      title: "Emergency Helplines",
      lines: ["+880 1700 112233", "+880 2 9876543"],
      label: "Available 24/7"
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Support Email Addresses",
      lines: ["support@carepulse.com", "billing@carepulse.com"],
      label: "Response within 12 hours"
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "CarePulse Medical Center",
      lines: ["House 12, Road 5, Dhanmondi", "Dhaka 1209, Bangladesh"],
      label: "Find us on map"
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Operational Hours",
      lines: ["Sat - Thu: 09:00 AM - 09:00 PM", "Friday: Emergency Only"],
      label: "Support Desk Timings"
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-955 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit your queries regarding appointment bills, doctor profiles, account block status, or general administrative questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {contactCards.map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex gap-4 items-start">
                <div className="p-3 bg-primary/5 rounded-xl text-primary flex-shrink-0">
                  {card.icon}
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white">{card.title}</h3>
                  {card.lines.map((line, lIdx) => (
                    <span key={lIdx} className="block text-slate-500 dark:text-slate-400 font-medium">{line}</span>
                  ))}
                  <span className="block text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-wide font-semibold pt-1">
                    {card.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Form Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="h-16 w-16 bg-green-50 dark:bg-green-955 text-green-550 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Submitted!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting CarePulse. Your message payload has been output to the console and simulates a successful backend dispatch. We will reply to your registered email shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-lg font-bold text-slate-955 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
                  Send Us an Inquiry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                      placeholder="johndoe@email.com"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...register("subject")}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                    placeholder="Billing Issue / Account status query"
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-destructive font-medium">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    {...register("message")}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors resize-none"
                    placeholder="Type your message details here..."
                  />
                  {errors.message && (
                    <p className="text-[11px] text-destructive font-medium">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
