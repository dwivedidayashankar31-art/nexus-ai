import { Link } from "wouter";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "hsl(240, 10%, 3.9%)" }}>

      <div className="text-center px-6 max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.18)"
          }}>
          <AlertTriangle className="w-7 h-7" style={{ color: "#F87171" }} />
        </div>

        <h1 className="font-bold text-white mb-2"
          style={{ fontSize: 22, letterSpacing: "-0.03em" }}>
          Page not found
        </h1>

        <p className="text-[13px] leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-[13px] transition-all duration-150 hover:-translate-y-[0.5px]"
            style={{
              background: "#3B82F6",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
            }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
}
