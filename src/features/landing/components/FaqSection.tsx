"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      q: "How does the video call consultation work?",
      a: "Once you book an appointment, a 'Join Video Call' button will become active in your Patient Dashboard when the time arrives. Simply click it to launch the secure video panel directly in your browser without downloading extra software."
    },
    {
      q: "Can I pay with credit cards?",
      a: "Yes, CarePulse integrates with Stripe to handle secure card payments. You can choose to 'Pay and Book' immediately via credit card, or select 'Book and Pay Later' to settle the balance from your dashboard within 30 minutes."
    },
    {
      q: "How do I download my prescription?",
      a: "After the doctor completes your appointment and inputs instructions, it appears in the 'My Prescriptions' tab on your Patient Dashboard. You will see a detailed list with a 'Download PDF' option."
    },
    {
      q: "Can I manage multiple medical reports?",
      a: "Absolutely. In your Health Profile tab, there is a Medical Reports Uploader where you can drag and drop up to 5 medical record files (PDFs/Images) which your consulting doctors can view during appointments."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Clear answers to the most common questions about the CarePulse platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 dark:border-slate-700/60 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-slate-400 ml-4">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-650 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    <p className="mt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
