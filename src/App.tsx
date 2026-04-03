export default function App() {
	return (
		<main className="min-h-screen bg-slate-950 text-slate-100">
			<section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-400">
					DocuChat
				</p>
				<h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
					React + TypeScript + Tailwind single-page app starter
				</h1>
				<p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
					This scaffold is intentionally minimal: no routing, no API client, just the
					foundation for your SPA.
				</p>
				<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 shadow-2xl shadow-cyan-950/20 backdrop-blur">
					Start building your chat UI here.
				</div>
			</section>
		</main>
	);
}
