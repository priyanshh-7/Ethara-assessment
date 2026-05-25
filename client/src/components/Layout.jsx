import { BookOpen, GraduationCap, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <NavLink className={navClass} to="/courses" onClick={() => setOpen(false)}>
        Courses
      </NavLink>
      {user?.role === "student" && (
        <NavLink className={navClass} to="/cart" onClick={() => setOpen(false)}>
          Cart
        </NavLink>
      )}
      {user?.role === "educator" && (
        <NavLink className={navClass} to="/studio" onClick={() => setOpen(false)}>
          Studio
        </NavLink>
      )}
      {user && (
        <NavLink className={navClass} to="/support" onClick={() => setOpen(false)}>
          Support
        </NavLink>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-teal text-white">
              <GraduationCap aria-hidden="true" />
            </span>
            Ethara Learn
          </Link>

          <div className="hidden items-center gap-1 md:flex">{links}</div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <NavLink className={navClass} to="/profile">
                  <span className="inline-flex items-center gap-2">
                    <UserRound size={16} aria-hidden="true" />
                    Profile
                  </span>
                </NavLink>
                <button className="rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className={navClass} to="/login">
                  Login
                </NavLink>
                <Link className="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft hover:bg-coral/90" to="/signup">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button className="grid h-10 w-10 place-items-center rounded-md border border-ink/10 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-ink/10 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {links}
              {user ? (
                <>
                  <NavLink className={navClass} to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </NavLink>
                  <button className="rounded-md border border-ink/15 px-3 py-2 text-left text-sm font-semibold" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink className={navClass} to="/login" onClick={() => setOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink className={navClass} to="/signup" onClick={() => setOpen(false)}>
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen size={20} aria-hidden="true" />
            Ethara Learn
          </div>
          <div className="flex gap-4 text-sm text-ink/60">
            <Link to="/courses">Courses</Link>
            <Link to="/support">Support</Link>
            <Link to="/cart" className="inline-flex items-center gap-1">
              <ShoppingCart size={15} aria-hidden="true" />
              Cart
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
