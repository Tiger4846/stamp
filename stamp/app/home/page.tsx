"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Sponsor {
  id: string;
  name: string;
  image: string;
  completed: boolean;
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    // Gold Sponsors
    {
      id: "zenith",
      name: "ZenithComp",
      image: "/images/GoldSponsor/1.svg",
      completed: false,
    },
    {
      id: "nutanix",
      name: "Nutanix",
      image: "/images/GoldSponsor/2.svg",
      completed: false,
    },
    {
      id: "trendmicro",
      name: "Trend Micro",
      image: "/images/GoldSponsor/3.svg",
      completed: false,
    },
    {
      id: "lenovo",
      name: "Lenovo",
      image: "/images/GoldSponsor/4.svg",
      completed: false,
    },
    {
      id: "hpearuba",
      name: "HPE Aruba",
      image: "/images/GoldSponsor/5.svg",
      completed: false,
    },
  ]);

  const [silverSponsors, setSilverSponsors] = useState<Sponsor[]>([
    {
      id: "oneidentity",
      name: "One Identity",
      image: "/images/SilverSponsor/1.svg",
      completed: false,
    },
    {
      id: "secsiron",
      name: "Secsiron",
      image: "/images/SilverSponsor/2.svg",
      completed: false,
    },
    {
      id: "pre",
      name: "PRE",
      image: "/images/SilverSponsor/3.svg",
      completed: false,
    },
    {
      id: "cloudflare",
      name: "CloudFlare",
      image: "/images/SilverSponsor/4.svg",
      completed: false,
    },
    {
      id: "cymulate",
      name: "Cymulate",
      image: "/images/SilverSponsor/5.svg",
      completed: false,
    },
    {
      id: "paloalto",
      name: "Palo Alto",
      image: "/images/SilverSponsor/6.svg",
      completed: false,
    },
    {
      id: "groupib",
      name: "Group-IB",
      image: "/images/SilverSponsor/7.svg",
      completed: false,
    },
    {
      id: "cyberark",
      name: "CyberARK",
      image: "/images/SilverSponsor/8.svg",
      completed: false,
    },
    {
      id: "fortinet",
      name: "Fortinet",
      image: "/images/SilverSponsor/9.svg",
      completed: false,
    },
    {
      id: "veeam",
      name: "Veeam",
      image: "/images/SilverSponsor/10.svg",
      completed: false,
    },
    {
      id: "vicarius",
      name: "Vicarius",
      image: "/images/SilverSponsor/11.svg",
      completed: false,
    },
    {
      id: "semperis",
      name: "Semperis",
      image: "/images/SilverSponsor/12.svg",
      completed: false,
    },
    {
      id: "radware",
      name: "Radware",
      image: "/images/SilverSponsor/13.svg",
      completed: false,
    },
    {
      id: "proofpoint",
      name: "Proofpoint",
      image: "/images/SilverSponsor/14.svg",
      completed: false,
    },
  ]);

  useEffect(() => {
    const loadData = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const { name } = JSON.parse(userData);
        setUserName(name);
      }

      // Load completed stamps from localStorage
      const savedStamps = localStorage.getItem("completedStamps");
      if (savedStamps) {
        const completed = JSON.parse(savedStamps);
        setSponsors((prev) =>
          prev.map((s) => ({ ...s, completed: completed.includes(s.id) }))
        );
        setSilverSponsors((prev) =>
          prev.map((s) => ({ ...s, completed: completed.includes(s.id) }))
        );
      }
    };

    loadData();
  }, []);

  const openQRModal = () => {
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
  };

  const resetAllStamps = () => {
    if (confirm("Are you sure you want to reset all stamps?")) {
      setSponsors((prev) => prev.map((s) => ({ ...s, completed: false })));
      setSilverSponsors((prev) =>
        prev.map((s) => ({ ...s, completed: false }))
      );
      localStorage.removeItem("completedStamps");
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
            K. {userName || "Guest"}
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
        <div className="mb-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 justify-items-center">
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
        <div className="mb-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 justify-items-center">
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
                QR Code - K. {userName || "Guest"}
              </h2>
              <p className="text-gray-500 mt-2">
                Show this QR code to collect stamps
              </p>
            </div>
            <div className="flex justify-center mb-6 flex-1 overflow-hidden">
              <div className="flex flex-col items-center">
                <Image
                  src="/qrcodes-mock/OIP.webp"
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
    </div>
  );
}
