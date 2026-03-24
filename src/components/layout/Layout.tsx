import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-[#F4F5F7]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
