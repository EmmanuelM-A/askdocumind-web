import { UPLOAD_LIMITS } from "@/config/constants";

type Extension = keyof typeof UPLOAD_LIMITS.MIME_TYPES;

export const ACCEPTED_EXTENSIONS = Object.keys(UPLOAD_LIMITS.MIME_TYPES) as Extension[];

function getExtension(filename: string): string {
	const dot = filename.lastIndexOf(".");
	return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

function isAcceptedExtension(extension: string): extension is Extension {
	return extension in UPLOAD_LIMITS.MIME_TYPES;
}

export function getUploadError(file: File, existingNames: string[]): string | null {
	if (!isAcceptedExtension(getExtension(file.name))) return "This file type isn't supported";
	if (file.size === 0) return "This file is empty";
	if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) return "Larger than the 10 MB limit";
	if (existingNames.includes(file.name)) return "A file with this name is already in the chat";
	if (existingNames.length >= UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT) {
		return `The chat already has ${UPLOAD_LIMITS.MAX_DOCUMENTS_PER_CHAT} documents`;
	}
	return null;
}

// Browsers send the wrong or an empty type for some code files (.ts as
// video/mp2t), which the API rejects, so the type is set from the extension.
export function withUploadMimeType(file: File): File {
	const extension = getExtension(file.name);
	if (!isAcceptedExtension(extension)) return file;

	return new File([file], file.name, { type: UPLOAD_LIMITS.MIME_TYPES[extension] });
}
