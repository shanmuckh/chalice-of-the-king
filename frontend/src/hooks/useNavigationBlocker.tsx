import { useState, useEffect, useCallback } from "react";
import { useBlocker } from "react-router-dom";
import type { Blocker } from "react-router-dom";

type UseNavigationBlockerOptions = {
  shouldBlock?: () => boolean;
  onConfirm?: () => void;
};

export function useNavigationBlocker({
  shouldBlock = () => true,
  onConfirm,
}: UseNavigationBlockerOptions = {}) {
  const blocker = useBlocker(shouldBlock);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingBlocker, setPendingBlocker] = useState<Blocker | null>(null);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setModalOpen(true);
      setPendingBlocker(blocker);
    }
  }, [blocker]);

  const confirmLeave = useCallback(() => {
    onConfirm?.(); // 👈 Call user-specified logic
    if (pendingBlocker?.state === "blocked") {
      pendingBlocker.proceed();
    }
    setModalOpen(false);
  }, [pendingBlocker, onConfirm]);

  const cancelLeave = useCallback(() => {
    if (pendingBlocker?.state === "blocked") {
      pendingBlocker.reset();
    }
    setModalOpen(false);
  }, [pendingBlocker]);

  return {
    isModalOpen,
    confirmLeave,
    cancelLeave,
  };
}
