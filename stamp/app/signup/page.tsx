import Image from "next/image";

export default function SignUp() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
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
      <div className="relative z-10 justify-center pt-10 sm:pt-20 md:pt-90 px-4">
        {/* Sign Up Form Container */}
        <div className="w-full max-w-md px-4 sm:px-6">
          {/* Form Card */}
          <div className="p-6">
            <h1 className="text-[36px] font-bold text-center mb-2 text-black">
              Register
            </h1>
            <p className="text-center text-[20px] text-black mb-4">
              Sign up to participate at each booth.
            </p>
            <form className="space-y-6 flex flex-col items-center">
              {/* Full Name */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="name"
                  className="block text-[18px] font-semibold text-black mb-2 self-start"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-[460px] h-11 px-4 rounded-full shadow-sm text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your name"
                  required
                />
              </div>

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
                Sign Up
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
