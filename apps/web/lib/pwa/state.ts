export type ConnectionStatus = "online" | "offline" | "reconnected";
export type InstallPromptStatus = "unsupported" | "available" | "dismissed" | "installed";
export type UpdatePromptStatus = "idle" | "available" | "activating";

export function getConnectionStatus(wasOnline: boolean, isOnline: boolean): ConnectionStatus {
  if (!isOnline) {
    return "offline";
  }

  return wasOnline ? "online" : "reconnected";
}

export function shouldShowInstallPrompt(status: InstallPromptStatus) {
  return status === "available";
}

export function shouldShowUpdatePrompt(status: UpdatePromptStatus) {
  return status === "available" || status === "activating";
}