import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">FocusFlow</h1>
        <p className="text-white/60 max-w-md">
          EEG-powered adaptive music for deep focus.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/setup"
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold"
          >
            Setup
          </Link>

          <Link
            to="/player"
            className="px-5 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 rounded-xl"
          >
            Player
          </Link>
        </div>
      </div>
    </div>
  );
}
