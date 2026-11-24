"use client";

import { Download, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaExperience() {
  const { t } = useLanguage();
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installError, setInstallError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => setInstalled(standaloneQuery.matches);
    const updateOnline = () => setOnline(navigator.onLine);
    const handleInstallPrompt = (event: Event) => {
      const promptEvent = event as InstallPromptEvent;
      promptEvent.preventDefault();
      setInstallPrompt(promptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInstructions(false);
    };

    updateInstalled();
    updateOnline();
    const readyFrame = window.requestAnimationFrame(() => setReady(true));

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("keydown", handleKeyDown);
    standaloneQuery.addEventListener("change", updateInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("keydown", handleKeyDown);
      standaloneQuery.removeEventListener("change", updateInstalled);
      window.cancelAnimationFrame(readyFrame);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setInstallPrompt(null);
    } catch {
      setInstallError(true);
      setShowInstructions(true);
    }
  }

  return (
    <>
      {!online && (
        <div
          className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-[#17211D] px-4 py-3 text-center text-sm font-medium text-white"
          role="status"
          aria-live="polite"
        >
          <WifiOff size={17} aria-hidden="true" />
          {t("pwa.offline")}
        </div>
      )}

      {ready && !installed && (
        <button
          type="button"
          onClick={installApp}
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-light sm:bottom-5"
          aria-label={t("pwa.install")}
        >
          <Download size={17} aria-hidden="true" />
          {t("pwa.install")}
        </button>
      )}

      {showInstructions && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowInstructions(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            className="my-auto w-full max-w-md rounded-2xl border border-border bg-surface p-5 text-text shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="install-title" className="text-lg font-bold">
                  {t("pwa.install")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("pwa.installDescription")}
                </p>
                {installError && (
                  <p className="mt-2 text-sm text-error">
                    {t("pwa.installError")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="rounded-lg p-2 text-muted hover:bg-background hover:text-text"
                aria-label={t("pwa.closeGuide")}
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-text">
              <li>
                <strong>Android (Chrome):</strong> {t("pwa.android")}
              </li>
              <li>
                <strong>iPhone/iPad (Safari):</strong> {t("pwa.apple")}
              </li>
              <li>
                <strong>Desktop (Chrome/Edge):</strong> {t("pwa.desktop")}
              </li>
            </ul>
          </section>
        </div>
      )}
    </>
  );
}
