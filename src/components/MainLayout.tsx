import { Outlet, Link, useLocation } from "react-router-dom";
import { PlaySquare, BarChart2, Menu, X, Wand2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const location = useLocation();

  const links = [
    { name: "Home", path: "/", icon: PlaySquare },
    { name: "Dashboard", path: "/dashboard", icon: BarChart2 },
    { name: "Ai Tools", path: "#", onClick: () => handleSoon("AI Tools feature is Coming Soon!"), icon: Wand2 },
  ];

  const handleSoon = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <PlaySquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                Ai Editing <span className="text-gradient">Reting</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {links.map((link) => {
                const isActive = location.pathname === link.path && link.path !== "#";
                return link.onClick ? (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className={`flex items-center space-x-1.5 text-sm font-medium transition-colors text-gray-400 hover:text-white`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-brand-purple" : ""}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple"
                        initial={false}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/pro"
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                Pro Plan
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute top-16 left-0 right-0 overflow-hidden bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {links.map((link) => 
                  link.onClick ? (
                    <button
                      key={link.name}
                      onClick={() => { link.onClick!(); setIsOpen(false); }}
                      className="flex items-center space-x-2 w-full p-4 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white font-medium text-left"
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="text-lg">{link.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 w-full p-4 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white font-medium text-left"
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="text-lg">{link.name}</span>
                    </Link>
                  )
                )}
                <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                  <Link 
                    to="/pro"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 neon-shadow transition-opacity text-center flex items-center justify-center"
                  >
                    Pro Plan
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 relative">
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className="fixed bottom-safe-offset-10 bottom-10 left-1/2 z-50 px-6 py-3 rounded-full bg-brand-purple text-white font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[150px]" />
        </div>
        
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-12 bg-black/40 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center space-x-2 text-center">
              <PlaySquare className="w-6 h-6 text-brand-purple" />
              <span className="font-bold text-lg text-white">Ai Editing Reting</span>
            </div>
            <p className="text-gray-400 italic text-sm text-center">Cut to inspire</p>
          </div>
          <p className="text-gray-500 text-sm text-center">
            © 2026 Ai Editing Reting. Analyzing videos locally. No data leaves your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
