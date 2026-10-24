export const APP_COLOR_BLUE = "rgba(157,214,252,1)";
export const APP_COLOR_PURPLE = "rgb(202, 160, 250)";
export const APP_COLOR_GRADIENT = "bg-gradient-to-r from-[rgba(209,127,247,1)] to-[rgba(157,214,252,1)]";

export const DRIVE_IO_BASE_URL = "https://www.driveio.io";
export const DRIVE_IO_COPY_FOLDER_URL = `${DRIVE_IO_BASE_URL}/standalone-plans/copy-folder-in-google-drive-extension`;

export const APP_NAME = "AskToDoc";

export function addReferrer(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}referrer=${APP_NAME}`;
}
