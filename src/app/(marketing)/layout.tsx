"use client";

import { Fade } from "react-awesome-reveal";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <Fade cascade damping={0.1} triggerOnce={true}>
      <div className="min-h-screen overflow-x-hidden">
        {children}
      </div>
    </Fade>
  );
}
