"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSponsors } from "@/hooks/useSponsors";
import { useRouter } from "next/navigation";

interface SponsorDisplay {
  id: string;
  name: string;
  image: string;
  completed: boolean;
}

export default function Home() {
  const { user } = useUser();
  const { sponsors: apiSponsors, completedSponsors, refetch } = useSponsors();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showAlreadyClaimedModal, setShowAlreadyClaimedModal] = useState(false);
  const [sponsors, setSponsors] = useState<SponsorDisplay[]>([]);
  const [silverSponsors, setSilverSponsors] = useState<SponsorDisplay[]>([]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const goldSponsors = apiSponsors
        .filter((s) => s.level === "gold")
        .map((s) => ({
          id: s.id,
          name: s.name,
          image: s.logoUrl || "/images/GoldSponsor/placeholder.svg",
          completed: completedSponsors.has(s.id),
        }));

      const silverSponsorsData = apiSponsors
        .filter((s) => s.level === "silver")
        .map((s) => ({
          id: s.id,
          name: s.name,
          image: s.logoUrl || "/images/SilverSponsor/placeholder.svg",
          completed: completedSponsors.has(s.id),
        }));

      setSponsors(goldSponsors);
      setSilverSponsors(silverSponsorsData);
    };

    if (apiSponsors.length > 0) {
      loadData();
    }
  }, [apiSponsors, completedSponsors]);

  const openQRModal = () => {
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    refetch();
  };

  const handleComplete = async () => {
    if (
      sponsors.every((s) => s.completed) &&
      silverSponsors.every((s) => s.completed)
    ) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token"); // ดึง Token จาก localStorage (key set by useSignIn)
        console.log("Claim: sending token present:", !!token);
        const response = await fetch("/api/user/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // เพิ่ม Token ใน Header
          },
        });

        if (response.ok) {
          setShowCompleteModal(true);
        } else if (response.status === 409) {
          // Already claimed
          setShowAlreadyClaimedModal(true);
        } else {
          console.error('Claim response status:', response.status);
          const data = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert(data.error || "Failed to complete. Please try again.");
        }
      } catch (error) {
        console.error("Error completing claim:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please complete all stamps before proceeding.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/BGblur.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Reset Button - Top Right
      <button
        onClick={resetAllStamps}
        className="absolute top-3 right-3 z-20 bg-red-500 text-white px-2 sm:px-4 py-2 text-xs sm:text-base rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-lg"
      >
        Reset
      </button> */}

      {/* Content */}
      <div className="relative z-10 w-[790px] max-w-[95vw] h-[880px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 sm:p-6">
        <div className="relative z-10 flex justify-center">
          <Image
            src="/images/Thepower.svg"
            alt="Zenith Logo"
            width={742}
            height={254}
            priority
            quality={100}
            unoptimized
            className="w-full max-w-[742px] h-auto"
          />
        </div>
        <div className="flex justify-between items-center my-4">
          <p className="text-[24px] text-[#E38533] font-bold mb-3">
            K. {user?.name || "Guest"}
          </p>
          <button
            onClick={openQRModal}
            className="bg-[#E38533] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#aa6427] transition-colors"
          >
            QRcode
          </button>
        </div>
        <div className="text-left mb-2 ">
          <p className="text-[20px] text-black font-bold mb-3">Gold Sponsor</p>
        </div>
        <div className="mb-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4 justify-items-center">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="relative shadow-md rounded-xl">
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                width={128}
                height={108}
                priority
                quality={100}
                unoptimized
                className="w-full max-w-[100px] h-auto"
              />
              {sponsor.completed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logos/ZenithSuccess.svg"
                    alt="Completed"
                    width={95}
                    height={95}
                    quality={100}
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-left mb-2 ">
          <p className="text-[20px] text-black font-bold mb-2">
            Silver Sponsor
          </p>
        </div>
        <div className="mb-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4 justify-items-center">
          {silverSponsors.map((sponsor) => (
            <div key={sponsor.id} className="relative shadow-md rounded-xl">
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                width={100}
                height={100}
                priority
                quality={100}
                unoptimized
                className="w-full max-w-[100px] h-auto"
              />
              {sponsor.completed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logos/ZenithSuccess.svg"
                    alt="Completed"
                    width={95}
                    height={95}
                    quality={100}
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Complete Button */}
        <div className="text-center mt-9">
          <button
            onClick={handleComplete}
            className={`font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg ${
              sponsors.every((s) => s.completed) &&
              silverSponsors.every((s) => s.completed)
                ? "bg-[#E38533] text-white hover:bg-[#aa6427]"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={
              !(
                sponsors.every((s) => s.completed) &&
                silverSponsors.every((s) => s.completed)
              ) || isSubmitting
            }
          >
            {isSubmitting ? "Submitting..." : "Complete"}
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeQRModal}
        >
          <div
            className="bg-white rounded-3xl p-4 sm:p-8 w-[95vw] sm:w-[458px] h-auto max-h-[90vh] mx-4 flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="justify-center flex mb-4">
              <Image
                src="/logos/bot.svg"
                alt="Completed"
                width={120}
                height={120}
                quality={100}
                unoptimized
              />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                QR Code - K. {user?.name || "Guest"}
              </h2>
              <p className="text-gray-500 mt-2">
                Show this QR code to collect stamps
              </p>
            </div>
            <div className="flex justify-center mb-6 flex-1 overflow-hidden">
              <div className="flex flex-col items-center">
                <Image
                  src={user?.qrCode || "/qrcodes-mock/OIP.webp"}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="object-contain w-full max-w-[300px] h-auto"
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  Scan to collect stamp
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={closeQRModal}
                className="w-[138px] h-11 bg-[#E38533] text-white py-3 rounded-full font-semibold hover:bg-[#aa6427] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-[90vw] shadow-2xl">
            <div className="flex justify-center mb-6">
              <Image
                src="/logos/thankyoubot.svg"
                alt="Congratulations"
                width={120}
                height={120}
                priority
                quality={100}
                unoptimized
              />
            </div>
            <h2 className="text-[24px] font-bold text-center text-[#E38533] mb-4">
              Congratulations!
            </h2>
            <p className="text-[16px] text-center text-[#6A6868] mb-4">
              You have successfully visited all booths
            </p>
            <hr className="my-4 border-t-2 border-dashed border-gray-300" />
            <p className="text-[16px] text-center text-[#6A6868] mb-2">
              Thank you for participating in our event!
            </p>
            <p className="text-[16px] text-center text-[#1A6FB1] font-bold">
              Please present this screen to our staff to
            </p>
            <p className="text-[16px] text-center text-[#1A6FB1] font-bold">
              receive your entry for the lucky draw.
            </p>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="bg-[#E38533] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#aa6427] transition-colors shadow-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Claimed Modal */}
      {showAlreadyClaimedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-[90vw] shadow-2xl">
            <div className="flex justify-center mb-6">
              <Image
                src="/logos/ZenithSuccess.svg"
                alt="Already Claimed"
                width={80}
                height={80}
                priority
                quality={100}
                unoptimized
              />
            </div>
            <h2 className="text-[22px] font-bold text-center text-[#E38533] mb-4">
              ข้อความแจ้งเตือน
            </h2>
            <p className="text-[16px] text-center text-[#6A6868] mb-4">
              คุณได้กดรับรางวัลไปแล้ว
            </p>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAlreadyClaimedModal(false)}
                className="bg-[#E38533] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#aa6427] transition-colors shadow-lg"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
