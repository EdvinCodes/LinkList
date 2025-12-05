import { Outlet } from "react-router-dom";
import Navbar from "@/nav-bar";
import { Footer } from "@/components/landing/footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Navbar Fijo Global */}
      <Navbar />

      {/* 2. El contenido de las páginas (App, CreatePlaylist, etc.) se renderiza aquí */}
      <div className="flex-1 w-full flex flex-col">
        <Outlet />
      </div>

      {/* 3. Footer Global */}
      {/* Nota: Si alguna página NO debe llevar footer, esto se puede ajustar, 
          pero por lo general va en todas. */}
      <Footer />
    </div>
  );
}
