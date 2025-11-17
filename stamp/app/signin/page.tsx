"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import usersData from "@/data/users.json";

export default function SignUp() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists in mock data
    const user = usersData.users.find(
      (u) => u.phone === phone
    );

    if (user) {
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify({ name: user.name, phone: user.phone }));
      router.push("/home");
    } else {
      setError("Invalid phone number. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Wave */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/BGwave.svg"
          alt="Background Wave"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="justify-center pt-10 sm:pt-20 md:pt-90 px-4">
        {/* Logo */}
        <div className="relative z-10 flex justify-center">
          <Image
            src="/logos/Zenith30.svg"
            alt="Zenith Logo"
            width={317}
            height={142}
            priority
            className="w-full max-w-[317px] h-auto"
          />
        </div>

        {/* Sign Up Form Container */}
        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
          {/* Form Card */}
          <div className="p-6">
            <h1 className="text-[36px] font-bold text-center mb-2 text-black">
              Sign in
            </h1>
            <p className="text-center text-[20px] text-black mb-4">
              Sign in to join the fun at each booth.
            </p>
            {error && (
              <p className="text-center text-sm text-red-600 mb-4">
                {error}
              </p>
            )}
            <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
              {/* Phone */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="phone"
                  className="block text-[18px] font-semibold text-black mb-2 self-start"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-[460px] h-11 px-4 rounded-full shadow-sm text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your phone"
                  required
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full max-w-[460px] h-11 bg-[#E38533] text-white rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg hover:shadow-sm"
              >
                Sign In
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
