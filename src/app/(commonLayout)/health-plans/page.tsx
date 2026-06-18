"use client";

import React, { useState } from "react";
import { 
  Check, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  Activity,
  Heart,
  Users
} from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnually: number;
  featured: boolean;
  colorTheme: string;
  icon: React.ReactNode;
  features: string[];
}

export default function HealthPlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  // Subscription Form States
  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("09/29");
  const [cvc, setCvc] = useState("456");
  const [processing, setProcessing] = useState(false);

  const plans: PlanTier[] = [
    {
      id: "plan-basic",
      name: "Basic Wellness",
      tagline: "Ideal for individuals seeking routine health checks.",
      priceMonthly: 299,
      priceAnnually: 2990,
      featured: false,
      colorTheme: "blue",
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      features: [
        "2 Free Video Consultations per month",
        "5% Discount on all Diagnostics & Scans",
        "24/7 Chat access with General Physicians",
        "Digital Prescription archiving & history",
        "Standard home sample collection (৳50 fee)"
      ]
    },
    {
      id: "plan-family",
      name: "Family Protection",
      tagline: "Complete care plan covering up to 4 family members.",
      priceMonthly: 899,
      priceAnnually: 8990,
      featured: true,
      colorTheme: "emerald",
      icon: <Users className="h-6 w-6 text-emerald-500" />,
      features: [
        "Unlimited Doctor Video Consultations",
        "15% Discount on Diagnostics & Pathology",
        "Free Home Sample Collection (No charge)",
        "Dedicated Care Concierge support desk",
        "Quarterly Routine checkups for primary member",
        "Shared digital health records folder"
      ]
    },
    {
      id: "plan-senior",
      name: "Senior Citizen Care",
      tagline: "Dedicated monitoring for elderly parents.",
      priceMonthly: 1299,
      priceAnnually: 12990,
      featured: false,
      colorTheme: "amber",
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
      features: [
        "Unlimited consultations with specialists",
        "Monthly Home Vital checks (sugar, BP, pulse)",
        "20% Discount on Imaging (MRI, CT, X-Ray)",
        "Priority clinical appointment scheduling",
        "Emergency hotline concierge desk",
        "Monthly medicine delivery discount (5% off)"
      ]
    },
    {
      id: "plan-chronic",
      name: "Cardiac & Chronic Care",
      tagline: "Specialized management for diabetic or cardiac issues.",
      priceMonthly: 1499,
      priceAnnually: 14990,
      featured: false,
      colorTheme: "rose",
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      features: [
        "Unlimited consultations + 2 Cardiologist visits",
        "25% Discount on Specialized Pathology",
        "Bi-annual ECG and Lipid Profile checks (Free)",
        "Custom diabetic diet chart & fitness plans",
        "Continuous glucose monitor configuration",
        "Free delivery on all monthly drug orders"
      ]
    }
  ];

  const handleOpenSubscribe = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setSubscribeModalOpen(true);
    setHolderName("");
    setProcessing(false);
  };

  const handleConfirmSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSubscribeModalOpen(false);
      setSuccessModalOpen(true);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-955 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Premium Subscription Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Unlock Year-Round Doctor Consultations & Diagnostic Benefits
          </h1>
          <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
            Choose a plan tailored to you or your family. Subscribe to save on medical checkups, receive priority clinic appointment scheduling, and maintain a healthier lifestyle.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Bill Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annually" : "monthly")}
              className="relative w-12 h-6.5 bg-slate-200 dark:bg-slate-800 rounded-full transition-colors focus:outline-hidden cursor-pointer"
            >
              <div 
                className={`absolute top-1 left-1 w-4.5 h-4.5 bg-primary rounded-full transition-transform ${
                  billingPeriod === "annually" ? "translate-x-5.5" : ""
                }`} 
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1 ${billingPeriod === "annually" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Bill Annually 
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
                Save 15%
              </span>
            </span>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const price = billingPeriod === "monthly" ? plan.priceMonthly : Math.round(plan.priceAnnually / 12);
            
            return (
              <div 
                key={plan.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xs flex flex-col justify-between relative group hover:shadow-md transition-all ${
                  plan.featured 
                    ? "border-emerald-500/50 ring-2 ring-emerald-500/10 scale-100 lg:scale-[1.03]" 
                    : "border-slate-150 dark:border-slate-800"
                }`}
              >
                {/* Popular Badge */}
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Zap className="h-3 w-3 fill-white" />
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  {/* Plan Top Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                          {plan.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold">{billingPeriod === "annually" ? "Billed yearly" : "Billed monthly"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Details */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">৳{price}</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">/month</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2 text-[11px] text-slate-655 dark:text-slate-300 font-medium leading-relaxed">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection CTA */}
                <div className="pt-8 border-t border-slate-50 dark:border-slate-850 mt-6">
                  <button 
                    onClick={() => handleOpenSubscribe(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      plan.featured
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trusted Highlights */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl flex-shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">No-commitment Subscriptions</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cancel or switch your healthcare plans anytime. Refund policy guidelines apply.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/contact" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Have Questions? Consult Support
            </a>
          </div>
        </div>
      </div>

      {/* Subscription Pay Modal */}
      <CustomModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        title="Subscribe to CarePulse Plan"
      >
        {selectedPlan && (
          <form onSubmit={handleConfirmSubscribe} className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between text-xs text-slate-500 gap-4">
              <div>
                <span className="block font-semibold text-slate-700 dark:text-slate-350">Selected Package:</span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">{selectedPlan.name}</span>
              </div>
              <div className="text-right">
                <span className="block font-semibold text-slate-700 dark:text-slate-350">Price:</span>
                <span className="text-primary font-black text-sm block mt-0.5">
                  ৳{billingPeriod === "monthly" ? selectedPlan.priceMonthly : Math.round(selectedPlan.priceAnnually / 12)}/mo
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Card Holder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Card Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    CVC *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="xxx"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors text-center"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSubscribeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 min-w-[120px] justify-center"
              >
                {processing ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Settle...
                  </>
                ) : (
                  "Pay & Subscribe"
                )}
              </button>
            </div>
          </form>
        )}
      </CustomModal>

      {/* Subscription Success Dialog */}
      <CustomModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Subscription Verified!"
      >
        <div className="text-center py-6 space-y-4">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Welcome to CarePulse Care</h3>
            <p className="text-xs text-slate-505 max-w-sm mx-auto leading-relaxed">
              Your billing details were successfully registered. Your CarePulse profile is now active on the <span className="font-extrabold text-emerald-600">{selectedPlan?.name}</span> package! Enjoy unlimited medical care benefits.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="bg-primary hover:bg-primary/95 text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors w-full sm:w-auto"
            >
              Done
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
