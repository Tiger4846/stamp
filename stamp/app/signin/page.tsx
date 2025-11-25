"use client";

import Image from "next/image";
import { useState } from "react";
import { useSignIn } from "@/hooks/useSignIn";

export default function SignIn() {
  const { signIn, isLoading, error, setError } = useSignIn();
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn({ phone });
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden">
      {/* Background Wave */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/BGwave.png"
          alt="Background Wave"
          fill
          className="object-cover object-top"
          priority
          quality={100}
          unoptimized
        />
      </div>
      <div className="relative z-10 justify-center pb-10 sm:pb-20 md:pb-25 px-4">
        <div className="w-full max-w-md px-4 sm:px-6">
          {/* Form Card */}
          <div className="p-6 sm:p-8 md:p-10">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-center mb-2 text-black">
              Sign in
            </h1>
            <p className="text-center text-[16px] sm:text-[20px] text-black mb-4">
              Sign in to join the fun at each booth.
            </p>
            {error && (
              <p className="text-center text-sm text-red-600 mb-4">{error}</p>
            )}
            <form
              className="space-y-6 flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              {/* Phone */}
              <div className="flex flex-col items-center w-full">
                <label
                  htmlFor="phone"
                  className="block text-[16px] sm:text-[18px] font-semibold text-black mb-2 self-start"
                >
                  Phone / Code
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full max-w-[300px] sm:max-w-[460px] h-11 px-4 rounded-full shadow-sm text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your phone / Code"
                  required
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[300px] sm:max-w-[460px] h-11 bg-[#E38533] text-white rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign In Link */}
            {/* <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p> */}
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-[90vw] shadow-2xl">
            <h2 className="text-[20px] font-bold text-center text-red-600 mb-4">
              Error
            </h2>
            <p className="text-[16px] text-center text-gray-800 mb-4">
              ไม่พบหมายเลขโทรศัพท์ในระบบ
            </p>
            <p className="text-[14px] text-center text-gray-600 mb-6">
              กรุณาลงทะเบียนก่อนเข้าใช้งาน
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setError("")}
                className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors shadow-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="bg-[#E38533] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#aa6427] transition-colors shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
