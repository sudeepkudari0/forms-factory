"use client";

import type React from "react";

const AnimatedText: React.FC = () => {
  return (
    <div className="flex flex-wrap text-muted-foreground max-w-2xl leading-normal sm:text-xl sm:leading-8">
      <span>Welcome to ThinkRoman Data Center, Where We Do Magic With Data</span>
      {/* <span className="block animate-colorCycle">Magic</span> */}
      {/* <span>&nbsp;With Data</span> */}
    </div>
  );
};

export default AnimatedText;
