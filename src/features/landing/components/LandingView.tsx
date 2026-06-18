import React from "react";
import CommonLayout from "@/app/(commonLayout)/layout";
import { HeroSection } from "./HeroSection";
import { Specialties } from "./Specialties";
import { HowItWorks } from "./HowItWorks";
import { FeaturedDoctors } from "./FeaturedDoctors";
import { Statistics } from "./Statistics";
import { FaqSection } from "./FaqSection";
import { CTASection } from "./CTASection";

export function LandingView() {
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
