import { Hero } from "../sections/Hero";
import { Features } from "../sections/Features";
import { DemoSection } from "../sections/DemoSection";
import { Providers } from "../sections/Providers";
import { Faq } from "../sections/Faq";
import { FinalCta } from "../sections/FinalCta";
import "../sections/home.css";

export function HomePage() {
  return (
    <main className="home-page" id="main-content" tabIndex={-1}>
      <Hero />
      <DemoSection />
      <Features />
      <Providers />
      <Faq />
      <FinalCta />
    </main>
  );
}
