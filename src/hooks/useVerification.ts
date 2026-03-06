import { useState, useCallback } from "react";

export type VerificationLevel = "none" | "basic" | "verified_student" | "verified_organizer";

export const getVerificationLevel = (): VerificationLevel => {
  const stored = localStorage.getItem("competa_verified");
  if (stored === "student") return "verified_student";
  if (stored === "organizer") return "verified_organizer";
  const onboarded = localStorage.getItem("competa_onboarded");
  if (onboarded) return "basic";
  return "none";
};

export const isVerified = (): boolean => {
  const level = getVerificationLevel();
  return level === "verified_student" || level === "verified_organizer";
};

export const useVerification = () => {
  const [showModal, setShowModal] = useState(false);
  const [verificationType, setVerificationType] = useState<"student" | "organizer">("student");

  const requireVerification = useCallback(
    (type: "student" | "organizer" = "student", onAlreadyVerified?: () => void) => {
      if (isVerified()) {
        onAlreadyVerified?.();
        return true;
      }
      setVerificationType(type);
      setShowModal(true);
      return false;
    },
    []
  );

  return {
    showModal,
    setShowModal,
    verificationType,
    requireVerification,
    isVerified: isVerified(),
    level: getVerificationLevel(),
  };
};
