import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import "./styles/index.css";
import * as Sentry from "@sentry/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/privacy" element={<PrivacyPage />} />
				<Route path="/terms" element={<TermsPage />} />
			</Routes>
		</BrowserRouter>
	</Sentry.ErrorBoundary>,
);
