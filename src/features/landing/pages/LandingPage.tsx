import React from "react";
import CommonLayout from "@/app/(commonLayout)/layout";
import { HeroSection } from "../components/HeroSection";
import { Specialties } from "../components/Specialties";
import { HowItWorks } from "../components/HowItWorks";
import { FeaturedDoctors } from "../components/FeaturedDoctors";
import { Statistics } from "../components/Statistics";
import { FaqSection } from "../components/FaqSection";
import { CTASection } from "../components/CTASection";

export function LandingPage() {
  return (
    <CommonLayout>
      <HeroSection />
      <Specialties />
      <HowItWorks />
      <FeaturedDoctors />
      <Statistics />
      <FaqSection />
      <CTASection />
    </CommonLayout>
  );
}
export default LandingPage;
