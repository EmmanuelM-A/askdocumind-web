import { AboutSection } from "@/components/sections/AboutSection";
import { BuiltWithSection } from "@/components/sections/BuiltWithSection";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { Hero } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { WhyItMattersSection } from "@/components/sections/WhyItMattersSection";

export default function Home() {
	return (
		<>
			<Hero />
			<ProblemSection />
			<AboutSection />
			<HowItWorksSection />
			<WhyItMattersSection />
			<BuiltWithSection />
			<ClosingCtaSection />
		</>
	);
}
