import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid min-h-[78vh] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden bg-slate-900 sm:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.45),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.28),transparent_35%)]" />
        <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-md" />
        <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Welcome Back</p>
            <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
              Sign in to continue shopping with real-time filters and personalized picks.
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {["Monstera", "Urban Sneakers", "Daily Serum", "Minimal Desk"].map((item) => (
              <div key={item} className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl">
                <div className="mb-2 h-16 rounded-lg bg-white/20" />
                <p className="text-sm font-medium">{item}</p>
                <p className="text-xs text-slate-200/90">Preview product catalog</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white p-6 md:p-10">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border border-slate-200 rounded-xl",
              headerTitle: "text-slate-900",
              headerSubtitle: "text-slate-500"
            }
          }}
        />
      </section>
    </div>
  );
}
