import { AboutSection } from "@/components/sections/AboutSection";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { Hero } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { WhoThisIsForSection } from "@/components/sections/WhoThisIsForSection";
import { WhyItMattersSection } from "@/components/sections/WhyItMattersSection";

export default function Home() {
	return (
		<>
			<Hero />
			<ProblemSection />
			<AboutSection />
			<WhoThisIsForSection />
			<HowItWorksSection />
			<WhyItMattersSection />
			<ClosingCtaSection />
		</>
	);
}
