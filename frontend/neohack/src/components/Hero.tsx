import Link from "next/link";
import React from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <div className="bg-primary text-primary-foreground py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href={ctaLink}
          className="bg-white text-primary px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
