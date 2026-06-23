import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import * as Sentry from "@sentry/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
		<App />
	</Sentry.ErrorBoundary>,
);
