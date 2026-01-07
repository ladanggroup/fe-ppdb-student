import { useState, useEffect, useMemo } from "react";
import { NavLink, Link, useNavigate, useLocation, useParams } from "react-router";
import {
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  FileText,
  Wallet,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Dropdown } from "@/components/ui/dropDown";

export default function Navbar() {
  const { slug: paramSlug } = useParams();
  const { logoutStudent, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!user;
  const slug = paramSlug || localStorage.getItem("slug");
  const hasSlug = !!slug;

  const schoolStudentStatus = useMemo(() => {
    if (!user?.school_students?.length || !slug) return null;
    return user.school_students.find((ss) => ss.school?.slug === slug)
      ?.selection_status;
  }, [user, slug]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  let menuItems = [];

  if (!hasSlug) {
    // menuItems = [{ name: "Home", href: "/", icon: <Home size={16} /> }];
  } else if (hasSlug && isLoggedIn) {
    menuItems = [
      { name: "Home", href: `/${slug}`, icon: <Home size={16} /> },
      {
        name: "Pendaftaran",
        href: `/student/${slug}/complete-registration`,
        icon: <FileText size={16} />,
      },
      {
        name: "Hasil Seleksi",
        href: "/student/selection",
        icon: <Wallet size={16} />,
      },
    ];
  } else {
    menuItems = [
      { name: "Home", 
        href: `/${slug}`, 
        icon: <Home size={16} /> },
      {
        name: "Pendaftaran",
        href: `/student/${slug}/login`,
        icon: <FileText size={16} />,
      },
      {
        name: "Hasil Seleksi",
        href: `/${slug}/announcement`,
        icon: <Wallet size={16} />,
      },
    ];
  }

  if (schoolStudentStatus === "passed_selection") {
    menuItems = menuItems.filter((item) => item.name !== "Pendaftaran");
  }

const baseMobileItems = hasSlug
  ? menuItems
  : [
      {
        name: "Home",
        href: "/",
        icon: <Home size={16} />,
      },
    ];

    const mobileMenuItems = isLoggedIn
  ? [
      ...baseMobileItems,
      {
        name: "Pengaturan",
        href: "/student/profile",
        icon: <Settings size={16} />,
      },
    ]
  : baseMobileItems;

  return (
    <header className="bg-white shadow z-20 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-orange-600">
          <img
            src="/src/assets/logo ppdb.png"
            className="h-12 rounded-full"
            alt="PPDB Online"
          />
        </Link>

        <nav className="hidden md:flex space-x-8 items-center justify-center flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                `font-medium px-2 py-1 rounded transition-colors ${
                  isActive
                    ? "text-[#3897F0]"
                    : "text-gray-700 hover:text-[#3897F0]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Dropdown
              theme={{
                bg: "bg-sky-50",
                text: "text-gray-900",
                border: "border-sky-200",
                hover: "hover:bg-sky-100",
                label: "text-sky-500",
                shadow: "shadow-lg",
              }}
              trigger={
                <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-[#3897F0] font-medium cursor-pointer">
                  <img
                    className="w-9 h-9 rounded-full object-cover border"
                    src={
                      user?.image ||
                      "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    alt="avatar"
                  />
                  <span>{user?.name}</span>
                </button>
              }
              items={[
                {
                    label: "Home",
                    onSelect: () => navigate(hasSlug ? `/${slug}` : "/"),
                },
                {
                  label: "Pengaturan",
                  onSelect: () => navigate("/student/profile"),
                },
                {
                  label: "Keluar",
                  onSelect: () => {
                    logoutStudent();
                    localStorage.removeItem("slug");
                    navigate(hasSlug ? `/${slug}` : "/");
                  },
                },
              ]}
            />
          ) : hasSlug ? (
            <Link
              to={`/student/${slug}/login`}
              className="text-sm font-medium text-gray-700 hover:text-[#3897F0] border border-[#3897F0] px-4 py-2 rounded-md"
            >
              Masuk
            </Link>
          ) : null}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[500px] border-t border-sky-200" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col bg-sky-100 p-4 space-y-2">
          {isLoggedIn && (
            <div className="flex items-center space-x-3 border-b border-sky-200 pb-3 mb-2">
              <img
                src={
                  user?.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}

          {mobileMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium ${
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-gray-700 hover:bg-sky-100 hover:text-sky-700"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {isLoggedIn && (
            <button
              onClick={() => {
                logoutStudent();
                localStorage.removeItem("slug");
                navigate(hasSlug ? `/${slug}` : "/");
              }}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 rounded px-3 py-2"
            >
              <LogOut size={16} />
              Keluar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
