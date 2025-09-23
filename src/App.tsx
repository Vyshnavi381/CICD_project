import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { MovieList } from "./components/MovieList";
import { MyBookings } from "./components/MyBookings";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"movies" | "bookings">("movies");

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: "linear-gradient(135deg, #0c0c2b 0%, #3a1c71 100%)"
    }}>
      <header className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm h-16 flex justify-between items-center border-b border-white/10 shadow-lg px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              JustBook
            </span>
          </h1>
          <Authenticated>
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab("movies")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "movies"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "bookings"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                My Bookings
              </button>
            </nav>
          </Authenticated>
        </div>
        <SignOutButton />
      </header>
      
      <main className="flex-1 p-6">
        <Content activeTab={activeTab} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ activeTab }: { activeTab: "movies" | "bookings" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">JustBook</span>
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Your ultimate movie ticket booking platform
            </p>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {loggedInUser?.email?.split('@')[0] ?? "friend"}!
          </h2>
          <p className="text-white/80 text-lg">
            {activeTab === "movies" ? "Discover amazing movies and book your tickets" : "Manage your movie bookings"}
          </p>
        </div>

        {activeTab === "movies" ? <MovieList /> : <MyBookings />}
      </Authenticated>
    </div>
  );
}
