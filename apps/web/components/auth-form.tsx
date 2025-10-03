"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { RiGithubLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@envyron/auth/client";

const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should be of minimum 8 characters")
    .max(16, "password should be of maximum 16 characters"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(1, "name is required"),
});

type SignInSchema = z.infer<typeof signInSchema>;

type SignUpSchema = z.infer<typeof signUpSchema>;

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOAuthLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social(
      { provider, callbackURL: "/dashboard" },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const signInForm = useForm({ resolver: zodResolver(signInSchema) });

  const signUpForm = useForm({ resolver: zodResolver(signUpSchema) });

  const handleSignInSubmit = async ({ email, password }: SignInSchema) => {
    if (Object.keys(signInForm.formState.errors).length !== 0) return;

    await authClient.signIn.email(
      { email, password, callbackURL: "/dashboard" },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message, {
            style: {
              backgroundColor: "#E63946",
            },
          });
        },
      },
    );
  };

  const handleSignUpSubmit = async ({
    name,
    email,
    password,
  }: SignUpSchema) => {
    if (Object.keys(signUpForm.formState.errors).length !== 0) return;

    await authClient.signUp.email(
      { name, email, password, callbackURL: "/dashboard" },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          toast.success(`Welcome aboard ${name.split(" ")[0]}!`, {
            style: {
              backgroundColor: "#2ECC71",
            },
          });
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message, {
            style: {
              backgroundColor: "#E63946",
            },
          });
        },
      },
    );
  };

  const handleTabChange = (signUp: boolean) => {
    setIsSignUp(signUp);
    signInForm.reset();
    signUpForm.reset();
  };

  return (
    <Card className="bg-[var(--envyron-navy)]/80 border-[var(--envyron-teal)]/30 backdrop-blur-sm hover:border-[var(--envyron-light-teal)]/50 transition-all duration-500">
      <div className="p-8">
        {/* Toggle between Sign In / Sign Up */}
        <div className="flex mb-8 bg-[var(--envyron-navy)]/60 rounded-lg p-1">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleTabChange(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 auth-tab-underline ${
              !isSignUp
                ? "bg-[var(--envyron-teal)] text-white shadow-sm active"
                : "text-[var(--envyron-light-teal)] hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleTabChange(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 auth-tab-underline ${
              isSignUp
                ? "bg-[var(--envyron-teal)] text-white shadow-sm active"
                : "text-[var(--envyron-light-teal)] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            disabled={loading}
            size="lg"
            onClick={() => handleOAuthLogin("github")}
            className="w-full bg-white text-[var(--envyron-navy)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold glow-on-hover hover:scale-105 transform"
          >
            <RiGithubLine className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>

          <Button
            disabled={loading}
            size="lg"
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            className="w-full border-[var(--envyron-light-teal)] text-[var(--envyron-light-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold bg-transparent glow-on-hover hover:scale-105 transform"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--envyron-teal)]/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[var(--envyron-navy)] text-[var(--envyron-light-teal)]/60">
              or continue with email
            </span>
          </div>
        </div>

        {/* Sign In Form */}
        {!isSignUp && (
          <form
            onSubmit={signInForm.handleSubmit(handleSignInSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="signin-email"
                className="text-[var(--envyron-light-teal)]"
              >
                Email
              </Label>
              <Input
                disabled={loading}
                id="signin-email"
                type="email"
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-[var(--envyron-light-teal)]/50 focus:border-[var(--envyron-light-teal)] focus:ring-[var(--envyron-light-teal)] transition-all duration-300"
                placeholder="Enter your email"
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {signInForm.formState.errors.email?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="signin-password"
                className="text-[var(--envyron-light-teal)]"
              >
                Password
              </Label>
              <Input
                disabled={loading}
                id="signin-password"
                type="password"
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-[var(--envyron-light-teal)]/50 focus:border-[var(--envyron-light-teal)] focus:ring-[var(--envyron-light-teal)] transition-all duration-300"
                placeholder="Enter your password"
                {...signInForm.register("password")}
              />
              {signInForm.formState.errors.password && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {signInForm.formState.errors.password?.message}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              type="submit"
              size="lg"
              className="w-full bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold glow-on-hover hover:scale-105 transform"
            >
              Continue
            </Button>
          </form>
        )}

        {/* Sign Up Form */}
        {isSignUp && (
          <form
            onSubmit={signUpForm.handleSubmit(handleSignUpSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="signup-name"
                className="text-[var(--envyron-light-teal)]"
              >
                Full Name
              </Label>
              <Input
                disabled={loading}
                id="signup-name"
                type="text"
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-[var(--envyron-light-teal)]/50 focus:border-[var(--envyron-light-teal)] focus:ring-[var(--envyron-light-teal)] transition-all duration-300"
                placeholder="Enter your full name"
                {...signUpForm.register("name")}
              />
              {signUpForm.formState.errors.name && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {signUpForm.formState.errors.name?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="signup-email"
                className="text-[var(--envyron-light-teal)]"
              >
                Email
              </Label>
              <Input
                disabled={loading}
                id="signup-email"
                type="email"
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-[var(--envyron-light-teal)]/50 focus:border-[var(--envyron-light-teal)] focus:ring-[var(--envyron-light-teal)] transition-all duration-300"
                placeholder="Enter your email"
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {signUpForm.formState.errors.email?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="signup-password"
                className="text-[var(--envyron-light-teal)]"
              >
                Password
              </Label>
              <Input
                disabled={loading}
                id="signup-password"
                type="password"
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-[var(--envyron-light-teal)]/50 focus:border-[var(--envyron-light-teal)] focus:ring-[var(--envyron-light-teal)] transition-all duration-300"
                placeholder="Enter your password"
                {...signUpForm.register("password")}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {signUpForm.formState.errors.password?.message}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              type="submit"
              size="lg"
              className="w-full bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] hover:text-[var(--envyron-navy)] transition-all duration-300 font-semibold glow-on-hover hover:scale-105 transform"
            >
              Create Account
            </Button>
          </form>
        )}

        {/* Forgot Password Link - only shown for Sign In */}
        {/* {!isSignUp && ( */}
        {/* 	<div className="text-center mt-4"> */}
        {/* 		<button */}
        {/* 			type="button" */}
        {/* 			className="text-[var(--envyron-light-teal)]/80 hover:text-[var(--envyron-light-teal)] text-sm transition-colors duration-300 hover:underline" */}
        {/* 		> */}
        {/* 			Forgot password? */}
        {/* 		</button> */}
        {/* 	</div> */}
        {/* )} */}
      </div>
    </Card>
  );
}
