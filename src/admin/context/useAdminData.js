import { useContext } from "react";
import { AdminDataContext } from "./adminDataContext";

export function useAdminData() {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error("useAdminData must be used inside AdminDataProvider");
  }

  return context;
}
