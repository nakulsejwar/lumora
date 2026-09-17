import Link from "next/link";
import { UserAuthForm } from "../../_components/user-login-form";
import { Sparkles, Search, ShieldCheck, BookOpen } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4 sm:p-6 selection:bg-[#fe932c]/30 text-[#131b2e]">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#c8c5d0]/70 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left / Primary Branding Area */}
        <div className="bg-[#070235] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#0091cf]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#fe932c]/10 rounded-full blur-3xl" />

          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0091cf]/20 border border-[#89ceff]/40 flex items-center justify-center text-[#89ceff]">
                <Search className="w-5 h-5 text-[#fe932c]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Lumora<span className="text-[#fe932c]">.</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0091cf]/15 text-[#89ceff] text-xs font-mono font-extrabold uppercase tracking-widest mb-4 border border-[#0091cf]/30">
              <BookOpen className="w-3.5 h-3.5 text-[#fe932c]" />
              <span>READER ACCESS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              YOUR NEXT READING MISSION AWAITS
            </h1>
            <p className="text-sm text-[#eaedff]/90 leading-relaxed font-medium">
              Return to your reading missions, track your 6 comprehension skills, and experience AI-adaptive coaching.
            </p>
          </div>
        </div>

        {/* Right / Form Area */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#070235] mb-1">
              WELCOME BACK, READER
            </h2>
            <p className="text-xs text-[#47464f] font-medium">
              Enter your credentials to return to your reading missions and continue building your skills.
            </p>
          </div>

          <UserAuthForm />

          <p className="mt-6 text-center text-xs text-[#47464f]">
            New to Lumora?{" "}
            <Link
              href="/register"
              className="font-extrabold text-[#070235] hover:text-[#0091cf] underline underline-offset-4 transition-colors"
            >
              Create an Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

