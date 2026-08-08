import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faBolt,
	faBookOpen,
	faClockRotateLeft,
	faCode,
	faCodeBranch,
	faFileImport,
	faFileLines,
	faGraduationCap,
	faMagnifyingGlass,
	faPlug,
	faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

// Central name -> icon lookup so content data (e.g. src/data/home/home.json) can
// reference an icon by string name instead of components hardcoding which icon
// goes with which card/position.
const iconRegistry: Record<string, IconDefinition> = {
	faBolt,
	faBookOpen,
	faClockRotateLeft,
	faCode,
	faCodeBranch,
	faFileImport,
	faFileLines,
	faGraduationCap,
	faMagnifyingGlass,
	faPlug,
	faShieldHalved,
};

export function resolveIcon(name: string | null | undefined): IconDefinition | undefined {
	if (!name) return undefined;
	return iconRegistry[name];
}
