import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import LoginForm from "@/forms/LoginForm";

const loginHeroImage =
  "https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1600";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4 text-foreground md:p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border bg-card shadow-sm md:min-h-[640px] md:grid-cols-[1.05fr_1fr]">
        <ResortImagePanel />

        <div className="flex flex-col justify-center p-5 sm:p-7 md:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                John Miko&apos;s Place
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to manage your bookings, settings, and guest details.
              </p>
            </div>

            <LoginForm />

            <div className="my-5 border-t" />

            <Button asChild variant="outline" className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              &copy; 2026 John Miko&apos;s Place. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const ResortImagePanel = () => (
  <div className="relative min-h-56 overflow-hidden md:min-h-full">
    <img
      src={loginHeroImage}
      alt="Poolside view at John Miko's Place"
      className="size-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/0 md:bg-linear-to-r md:from-black/70 md:via-black/15 md:to-black/0" />

    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
      <p className="text-sm font-semibold">John Miko&apos;s Place</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/90">
        Experience seamless hospitality. Sign in to manage your stay and booking details.
      </p>
    </div>
  </div>
);
