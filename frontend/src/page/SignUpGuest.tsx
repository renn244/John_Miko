import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import SignUpGuestForm from "@/forms/SignUpGuestForm";

const signUpHeroImage =
  "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1600&q=80";

export default function SignUpGuest() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4 text-foreground md:p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border bg-card shadow-sm md:min-h-[680px] md:grid-cols-[1fr_1.08fr]">
        <ResortImagePanel />

        <div className="flex flex-col justify-center p-5 sm:p-7 md:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                John Miko&apos;s Place
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal text-foreground">
                Create Account
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign up to book accommodations, manage reservations, and track your stay.
              </p>
            </div>

            <SignUpGuestForm />

            <div className="my-5 border-t" />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>

            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

const ResortImagePanel = () => (
  <div className="relative min-h-56 overflow-hidden md:min-h-full">
    <img
      src={signUpHeroImage}
      alt="Pool and cottages at John Miko's Place"
      className="size-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/0 md:bg-linear-to-r md:from-black/70 md:via-black/15 md:to-black/0" />

    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
      <p className="text-sm font-semibold">John Miko&apos;s Place</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/90">
        Create your guest account and book your next stay with ease.
      </p>
    </div>
  </div>
);
