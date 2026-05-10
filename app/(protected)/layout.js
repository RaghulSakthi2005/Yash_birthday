"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import FloatingPets from "@/components/FloatingPets";

export default function ProtectedLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for the unlock cookie
    const isUnlocked = document.cookie.split("; ").some(row => row.startsWith("hbd_unlocked="));
    
    if (!isUnlocked) {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{ background: "#080610", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>
          verifying access...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main style={{ paddingBottom: 0 }}>{children}</main>
    </>
  );
}
