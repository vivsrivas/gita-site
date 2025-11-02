import { Menu, X } from "lucide-react";
import SearchBox from "./SearchBox";

export default function Header({ sidebarOpen, setSidebarOpen, onSearch }) {
  // Ensure function safety
  const toggleSidebar = () => {
    if (typeof setSidebarOpen === "function") {
      setSidebarOpen(!sidebarOpen);
    } else {
      console.error("❌ setSidebarOpen is not a function");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[64px] bg-white border-b border-gray-200 shadow-sm z-50 flex items-center px-4">
      {/* 🔹 Hamburger for mobile */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🔹 Title */}
      <h1 className="text-xl font-bold tracking-wide text-[#c77d28] whitespace-nowrap">
        Bhagavad Gita
      </h1>

      {/* 🔹 Centered Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="w-[80%] max-w-xl hidden sm:block">
          <SearchBox onSearch={onSearch} />
        </div>
      </div>
    </header>
  );
}
