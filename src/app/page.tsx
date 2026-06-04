"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";

const CLICK_THRESHOLD = 5;

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldOpen =
      searchParams.get("admin") === "1" || window.location.hash === "#admin";
    if (shouldOpen) setShowAdmin(true);
  }, [searchParams]);

  const handleTrigger = () => {
    const next = clicks + 1;
    if (next >= CLICK_THRESHOLD) {
      setShowAdmin(true);
      setClicks(0);
      return;
    }
    setClicks(next);
  };

  const handleFooterClick = () => handleTrigger();

  const handleFooterKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTrigger();
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);
    // Simple credential check; replace with real auth as needed
    setTimeout(() => {
      if (email.trim() === "user123" && password.trim() === "user123456") {
        setShowAdmin(false);
        setEmail("");
        setPassword("");
        setError("");
        router.push("/admin");
      } else {
        setError("Invalid credentials");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-10 md:pt-16">
        <ImageGallery />
      </main>
      <footer
        className="w-full py-8 px-6 md:px-12 text-center"
        onClick={handleFooterClick}
        onKeyDown={handleFooterKey}
        tabIndex={0}
      >
        <p
          className="text-[10px] tracking-widest uppercase text-neutral-400 cursor-pointer select-none"
        >
          &copy;2026 ChenYuanzhuo
        </p>
      </footer>

      {showAdmin && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white border border-neutral-200 shadow-2xl p-8">
            <button
              className="absolute right-3 top-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-black"
              onClick={() => setShowAdmin(false)}
            >
              Close
            </button>
            <h2 className="text-center text-sm font-semibold tracking-widest uppercase text-neutral-900 mb-6">
              Admin Login
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <label className="flex flex-col text-xs tracking-widest uppercase text-neutral-600 gap-1">
                Email
                <input
                  type="text"
                  required
                  className="border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user123"
                />
              </label>
              <label className="flex flex-col text-xs tracking-widest uppercase text-neutral-600 gap-1">
                Password
                <input
                  type="password"
                  required
                  className="border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>
              {error && (
                <p className="text-[11px] text-red-500 tracking-tight">{error}</p>
              )}
              <button
                type="submit"
                className="mt-2 bg-neutral-900 text-white py-2 text-xs tracking-widest uppercase hover:bg-black disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Entering..." : "Enter Admin"}
              </button>
            </form>
            <p className="mt-4 text-[11px] text-neutral-500 text-center">
              Placeholder portal — will route to admin dashboard after login.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
