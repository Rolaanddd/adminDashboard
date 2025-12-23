import SideBar from "../components/SideBar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F5F5F0]">
      <SideBar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
