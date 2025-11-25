// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { useSignUp } from "@/hooks/useSignUp";

// export default function SignUp() {
//   const { signUp, isLoading, error, setError } = useSignUp();
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await signUp({ name, phone });
//     } catch (err) {
//       console.error("Sign up error:", err);
//     }
//   };

//   return (
//     <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
//       {/* Background Wave */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/backgrounds/BGwave.png"
//           alt="Background Wave"
//           fill
//           className="object-cover object-top"
//           priority
//           quality={100}
//           unoptimized
//         />
//       </div>
//       <div className="relative z-10 justify-center pt-10 sm:pt-20 md:pt-90 px-4">
//         {/* Sign Up Form Container */}
//         <div className="w-full max-w-md px-4 sm:px-6">
//           {/* Form Card */}
//           <div className="p-6">
//             <h1 className="text-[28px] sm:text-[36px] font-bold text-center mb-2 text-black">
//               Register
//             </h1>
//             <p className="text-center text-[16px] sm:text-[20px] text-black mb-4">
//               Sign up to participate at each booth.
//             </p>
//             {error && (
//               <p className="text-center text-sm text-red-600 mb-4">{error}</p>
//             )}
//             <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
//               {/* Full Name */}
//               <div className="flex flex-col items-center w-full">
//                 <label
//                   htmlFor="name"
//                   className="block text-[16px] sm:text-[18px] font-semibold text-black mb-2 self-start"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full max-w-[300px] sm:max-w-[460px] h-11 px-4 rounded-full shadow-sm text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="Enter your name"
//                   required
//                 />
//               </div>

//               {/* Phone */}
//               <div className="flex flex-col items-center w-full">
//                 <label
//                   htmlFor="phone"
//                   className="block text-[16px] sm:text-[18px] font-semibold text-black mb-2 self-start"
//                 >
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full max-w-[300px] sm:max-w-[460px] h-11 px-4 rounded-full shadow-sm text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="Enter your phone"
//                   required
//                 />
//               </div>

//               {/* Sign Up Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full max-w-[300px] sm:max-w-[460px] h-11 bg-[#E38533] text-white rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? "Signing Up..." : "Sign Up"}
//               </button>
//             </form>

//             {/* Sign In Link */}
//             <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
//               Already have an account?{" "}
//               <a
//                 href="/signin"
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Sign In
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Error Popup */}
//       {error && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-3xl p-6 max-w-md w-[90vw] shadow-2xl">
//             <h2 className="text-[20px] font-bold text-center text-red-600 mb-4">
//               Error
//             </h2>
//             <p className="text-[16px] text-center text-gray-800 mb-4">
//               {error}
//             </p>
//             <div className="text-center mt-6">
//               <button
//                 onClick={() => setError("")}
//                 className="bg-[#E38533] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#aa6427] transition-colors shadow-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
