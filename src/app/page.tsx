import { AboutSection } from "@/components/home/AboutSection";
import { ClosingCtaSection } from "@/components/home/ClosingCtaSection";
import { Hero } from "@/components/home/Hero";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { WhoThisIsForSection } from "@/components/home/WhoThisIsForSection";
import { WhyItMattersSection } from "@/components/home/WhyItMattersSection";

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
