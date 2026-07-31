"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, WifiOff } from "lucide-react";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { PWAUpdatePrompt } from "./PWAUpdatePrompt";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const installDismissedKey = "maried:pwa-install-dismissed-at";
const installDismissalTtlMs = 1000 * 60 * 60 * 24 * 14;

function isStandaloneDisplay() {
  return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
}

function installDismissalIsFresh() {
  const value = window.localStorage.getItem(installDismissedKey);
  if (!value) {
    return false;
  }

  const timestamp = Number(value);
  return Number.isFinite(timestamp) && Date.now() - timestamp < installDismissalTtlMs;
}

export function PWAController() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [updateVersion, setUpdateVersion] = useState<string | undefined>();
  const [isActivatingUpdate, setIsActivatingUpdate] = useState(false);
  const controlledReloadRef = useRef(false);
  const explicitUpdateRef = useRef(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);
    setIsInstalled(isStandaloneDisplay());

    const handleOffline = () => {
      wasOfflineRef.current = true;
      setShowReconnected(false);
      setIsOnline(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOfflineRef.current) {
        setShowReconnected(true);
        window.setTimeout(() => setShowReconnected(false), 5200);
      }
      wasOfflineRef.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (!isInstalled && !installDismissalIsFresh()) {
        setInstallPrompt(event as BeforeInstallPromptEvent);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      window.localStorage.setItem(installDismissedKey, String(Date.now()));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "MARIED_SW_VERSION") {
        setUpdateVersion(event.data.version);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting);
          registration.waiting.postMessage({ type: "MARIED_GET_VERSION" });
        }

        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) {
            return;
          }

          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(installingWorker);
              installingWorker.postMessage({ type: "MARIED_GET_VERSION" });
            }
          });
        });

        void registration.update();
      })
      .catch(() => {
        setWaitingWorker(null);
      });

    const handleControllerChange = () => {
      if (!explicitUpdateRef.current || controlledReloadRef.current) {
        return;
      }
      controlledReloadRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "dismissed") {
      window.localStorage.setItem(installDismissedKey, String(Date.now()));
    }
    setInstallPrompt(null);
  };

  const handleDismissInstall = () => {
    window.localStorage.setItem(installDismissedKey, String(Date.now()));
    setInstallPrompt(null);
  };

  const handleUpdate = () => {
    if (!waitingWorker) {
      return;
    }

    explicitUpdateRef.current = true;
    setIsActivatingUpdate(true);
    waitingWorker.postMessage({ type: "MARIED_SKIP_WAITING" });
  };

  const hasPrompt = installPrompt || waitingWorker || !isOnline || showReconnected;

  if (!hasPrompt) {
    return null;
  }

  return (
    <div className="pwa-feedback-layer" aria-live="polite" aria-relevant="additions text">
      {!isOnline ? (
        <section className="pwa-status pwa-status--offline" role="status">
          <WifiOff aria-hidden="true" size={18} />
          <span>Voce esta sem conexao. Recursos do servidor ficam indisponiveis agora.</span>
        </section>
      ) : null}
      {showReconnected ? (
        <section className="pwa-status pwa-status--online" role="status">
          <CheckCircle2 aria-hidden="true" size={18} />
          <span>Conexao restabelecida. Voce pode tentar a acao novamente.</span>
        </section>
      ) : null}
      {waitingWorker ? <PWAUpdatePrompt activating={isActivatingUpdate} version={updateVersion} onUpdate={handleUpdate} onDismiss={() => setWaitingWorker(null)} /> : null}
      {installPrompt ? <PWAInstallPrompt onInstall={handleInstall} onDismiss={handleDismissInstall} /> : null}
    </div>
  );
}