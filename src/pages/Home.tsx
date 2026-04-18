import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Layers, Code2, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Redux Toolkit + RTK Query",
    description:
      "Pre-configured Redux store with persist, typed hooks, and RTK Query base API — ready to plug in your endpoints.",
    color: "from-[#124e66] to-[#2e3944]",
  },
  {
    icon: Shield,
    title: "Auth & Route Guards",
    description:
      "Login, Signup with Zod validation + react-hook-form. Private & Admin routes with a handy bypass flag for development.",
    color: "from-[#1a7a5e] to-[#124e66]",
  },
  {
    icon: Zap,
    title: "ShadCN UI Components",
    description:
      "Popover, Avatar, Button and more from Radix UI + ShadCN, styled with Tailwind CSS v4.",
    color: "from-[#2e3944] to-[#748d92]",
  },
  {
    icon: Users,
    title: "Admin Dashboard",
    description:
      "Fully built admin panel with sidebar, stats, user management table, and settings — just add your data.",
    color: "from-[#748d92] to-[#2e3944]",
  },
  {
    icon: BarChart3,
    title: "User Dashboard",
    description:
      "User-facing dashboard with profile management, order history, and quick stats — ready to extend.",
    color: "from-[#124e66] to-[#748d92]",
  },
  {
    icon: Code2,
    title: "TypeScript First",
    description:
      "Strict TypeScript throughout — store types, API types, component props — no `any` by default.",
    color: "from-[#2e3944] to-[#124e66]",
  },
];

const Home: React.FC = () => {
  return (
    <div className="bg-[#0f1117] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#124e66]/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#748d92]/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#748d92] font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#748d92] animate-pulse" />
            React TypeScript Starter Template
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Build Faster with a
            <br />
            <span className="bg-gradient-to-r from-[#124e66] via-[#748d92] to-[#d3d9d4] bg-clip-text text-transparent">
              Production-Ready Template
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Skip hours of setup. This template gives you Redux Toolkit, RTK Query, auth,
            admin dashboard, user dashboard, ShadCN UI, and TypeScript — all working together, out of the box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#124e66]/30 border border-white/10"
            >
              View User Dashboard <ArrowRight size={16} />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors border border-white/10"
            >
              View Admin Panel
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-16 w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#1a1d27] overflow-hidden shadow-2xl shadow-black/50 sm:hidden md:block">
            <div className="h-8 bg-[#212a31] flex items-center gap-1.5 px-4 border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-gray-500">localhost:5173/dashboard</span>
            </div>
            <div className="grid grid-cols-4 min-h-48">
              {/* Fake sidebar */}
              <div className="col-span-1 bg-[#212a31] border-r border-white/5 p-4 space-y-2">
                {["Dashboard", "Users", "Settings"].map((item) => (
                  <div key={item} className={`h-7 rounded-lg ${item === "Dashboard" ? "bg-[#124e66]/70" : "bg-white/5"} flex items-center px-2`}>
                    <span className="text-xs text-gray-400 truncate">{item}</span>
                  </div>
                ))}
              </div>
              {/* Fake content */}
              <div className="col-span-3 p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {["12k", "$84k", "618"].map((val) => (
                    <div key={val} className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/5">
                      <div className="text-sm sm:text-lg font-bold text-white">{val}</div>
                      <div className="h-1.5 w-8 sm:w-12 bg-white/10 rounded-full mt-1 sm:mt-1.5" />
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl h-20 border border-white/5 flex items-center justify-center">
                  <div className="flex gap-1 items-end">
                    {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
                      <div
                        key={i}
                        className="w-5 rounded-t-sm bg-gradient-to-t from-[#124e66] to-[#748d92] opacity-80"
                        style={{ height: `${h * 0.5}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Everything You Need</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            A comprehensive set of tools and patterns baked right in so you can focus on building your product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-r from-[#124e66] via-[#2e3944] to-[#212a31] p-10 text-center relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 0% 100%, #748d92 0%, transparent 50%), radial-gradient(circle at 100% 0%, #124e66 0%, transparent 50%)" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to start building?</h2>
            <p className="text-gray-300 text-sm mb-7 max-w-md mx-auto">
              Clone the repo, configure your API URL in <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">.env</code>, and you're live.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#212a31] font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/10"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
