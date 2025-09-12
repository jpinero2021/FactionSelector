import { useState, useEffect } from "react";

const USER_REGISTRATION_KEY = "user-registration-id";
const USER_OWNER_SECRET_KEY = "user-owner-secret";

export function useUserRegistration() {
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string | null>(null);
  const [currentOwnerSecret, setCurrentOwnerSecret] = useState<string | null>(null);

  // Load registration data from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(USER_REGISTRATION_KEY);
    const savedSecret = localStorage.getItem(USER_OWNER_SECRET_KEY);
    setCurrentRegistrationId(savedId);
    setCurrentOwnerSecret(savedSecret);
  }, []);

  const saveRegistrationData = (id: string, ownerSecret: string) => {
    localStorage.setItem(USER_REGISTRATION_KEY, id);
    localStorage.setItem(USER_OWNER_SECRET_KEY, ownerSecret);
    setCurrentRegistrationId(id);
    setCurrentOwnerSecret(ownerSecret);
  };

  // Backward compatibility method
  const saveRegistrationId = (id: string) => {
    localStorage.setItem(USER_REGISTRATION_KEY, id);
    setCurrentRegistrationId(id);
  };

  const clearRegistrationId = () => {
    localStorage.removeItem(USER_REGISTRATION_KEY);
    localStorage.removeItem(USER_OWNER_SECRET_KEY);
    setCurrentRegistrationId(null);
    setCurrentOwnerSecret(null);
  };

  const hasRegistration = () => {
    return currentRegistrationId !== null && currentOwnerSecret !== null;
  };

  const getOwnerSecret = () => {
    return currentOwnerSecret;
  };

  return {
    currentRegistrationId,
    currentOwnerSecret,
    saveRegistrationData,
    saveRegistrationId, // Keep for backward compatibility
    clearRegistrationId,
    hasRegistration,
    getOwnerSecret,
  };
}