import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "홈", href: "#home" },
  { label: "소개", href: "#about" },
  { label: "서비스", href: "#service" },
  { label: "제작 과정", href: "#process" },
  { label: "포트폴리오", href: "#portfolio" },
  { label: "문의", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <button
          onClick={() => handleClick("#home")}
          className="text-foreground hover:text-primary transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.1em" }}
        >
          COUCHPOTATO
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleClick(item.href)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleClick("#contact")}
              className="bg-primary text-primary-foreground px-5 py-2 text-sm hover:bg-primary/90 transition-colors"
              style={{ borderRadius: "2px" }}
            >
              상담 신청
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="text-muted-foreground hover:text-foreground text-sm text-left transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#contact")}
            className="bg-primary text-primary-foreground px-5 py-2 text-sm w-fit"
            style={{ borderRadius: "2px" }}
          >
            상담 신청
          </button>
        </div>
      )}
    </nav>
  );
}
