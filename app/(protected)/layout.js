import Navigation from "@/components/Navigation";
import FloatingPets from "@/components/FloatingPets";


export default function ProtectedLayout({ children }) {
  return (
    <>
      <Navigation />
      <main style={{ paddingBottom: 140 }}>{children}</main>
    </>
  );
}
