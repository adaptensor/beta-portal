import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#0A0A0A] border border-[#1E1E1E]",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border-[#1E1E1E] text-white hover:bg-[#111111]",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "bg-[#111111] border-[#1E1E1E] text-white placeholder:text-zinc-500",
            footerActionLink: "text-brand-cyan hover:text-brand-cyan",
            formButtonPrimary:
              "bg-brand-yellow text-brand-black hover:bg-brand-yellow/90",
          },
        }}
      />
    </div>
  );
}
