"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { useStampAdd } from "@/hooks/useStampAdd";

interface SuccessData {
  userName: string;
  sponsorName: string;
  totalStamps: number;
}

export default function AdminScan() {
  const router = useRouter();
  const { addStamp, isLoading, error } = useStampAdd();
  const [adminName, setAdminName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check if user is admin
    const checkAuth = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const { name, role } = JSON.parse(userData);
        if (role !== "admin") {
          router.push("/home");
          return;
        }
        setAdminName(name);
      } else {
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    html5QrCodeRef.current = null;
    setScanning(false);
  };

  const processQRCode = async (data: string) => {
    // Prevent multiple simultaneous processing
    if (isProcessing) {
      console.log("Already processing, skipping...");
      return;
    }

    // Validate phone number format
    if (!data.trim()) {
      setMessage("❌ Invalid QR code data");
      return;
    }

    setIsProcessing(true);
    
    try {
      setMessage("⏳ Processing stamp...");
      const response = await addStamp({ phone: data });
      
      if (response) {
        // Show success modal
        setSuccessData({
          userName: response.user.name,
          sponsorName: response.sponsor.name,
          totalStamps: response.newTotal,
        });
        setShowSuccessModal(true);
        setScannedData("");
        // Stop scanner after successful scan
        await stopScanning();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add stamp";
      
      // Handle authentication errors
      if (
        errorMessage.toLowerCase().includes('authentication') || 
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('unauthorized')
      ) {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        setMessage("❌ Session expired. Redirecting to login...");
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
        return;
      }
      
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle scanner initialization and cleanup
  useEffect(() => {
    let mounted = true;

    const initScanner = async () => {
      if (!scanning || !qrReaderRef.current) return;

      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: "environment" }, // Use back camera
          config,
          (decodedText) => {
            if (mounted) {
              console.log("QR Code detected:", decodedText);
              setMessage(`✅ QR Code scanned: ${decodedText}`);
              processQRCode(decodedText);
            }
          },
          (errorMessage) => {
            // Ignore continuous scanning errors
            // Only log for debugging
            // console.log("Scan error:", errorMessage);
          }
        );

        if (mounted) {
          setMessage("✅ Camera is ready! Point at QR code");
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
        if (mounted) {
          setMessage(
            `❌ Cannot start camera: ${
              err instanceof Error ? err.message : "Unknown error"
            }. Please use manual input.`
          );
          setScanning(false);
        }
      }
    };

    if (scanning) {
      // Small delay to ensure DOM is ready
      setTimeout(initScanner, 100);
    }

    // Cleanup function
    return () => {
      mounted = false;
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current?.clear();
          })
          .catch((err) => {
            console.error("Cleanup error:", err);
          });
      }
    };
  }, [scanning]); // Remove processQRCode from dependencies to avoid recreation

  const startScanning = async (forceEnable = false) => {
    // Check if running on HTTPS or localhost
    const isDevelopment = process.env.NODE_ENV === "development";
    if (
      !forceEnable &&
      !isDevelopment &&
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setMessage(
        "❌ Camera access requires HTTPS or localhost. Please use manual input or access via secure connection."
      );
      return;
    }

    setMessage("📷 Initializing camera...");
    setScanning(true);
  };

  const handleManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedData.trim()) {
      processQRCode(scannedData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setMessage("");
    setSuccessData(null);
  };

  const handleScanNext = () => {
    setShowSuccessModal(false);
    setMessage("");
    setSuccessData(null);
    startScanning(false);
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

      {/* Logout Button - Top Right */}
      <button
        onClick={handleLogout}
        className="absolute top-3 right-3 z-20 bg-red-500 text-white px-2 sm:px-4 py-2 text-xs sm:text-base rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-lg"
      >
        Logout
      </button>

      {/* Content */}
      <div className="relative z-10 w-[790px] max-w-[95vw] h-[880px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 sm:p-6">
        <div className="relative z-10 flex justify-center mb-6">
          <Image
            src="/logos/Zenith30.svg"
            alt="Zenith Logo"
            width={317}
            height={142}
            priority
            quality={100}
            unoptimized
            className="w-full max-w-[317px] h-auto"
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-[20px] text-gray-600">
            Welcome, {adminName || "Admin"}
          </p>
        </div>

        {/* Scanner Section */}
        <div className="flex flex-col items-center gap-6">
          {/* Camera View */}
          <div className="w-full max-w-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            {scanning ? (
              <div className="relative aspect-square bg-black">
                <div 
                  ref={qrReaderRef}
                  id="qr-reader" 
                  className="w-full h-full"
                ></div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white bg-black/50 px-4 py-2 rounded-full inline-block">
                    {isProcessing ? "Processing..." : "Camera Active - Point at QR Code"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center p-8">
                <svg
                  className="w-32 h-32 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-gray-500 text-center">
                  Click &quot;Start Scanner&quot; to begin scanning QR codes
                </p>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            {!scanning ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startScanning(false)}
                  disabled={isProcessing}
                  className="w-full h-12 bg-[#E38533] text-white rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Start Scanner
                </button>
                {message.includes("❌") && message.includes("HTTPS") && (
                  <div className="text-center">
                    <button
                      onClick={() => startScanning(true)}
                      className="w-full h-10 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition-colors shadow-lg text-sm"
                    >
                      ⚠️ Force Enable Camera (Development)
                    </button>
                    <p className="text-xs text-gray-600 mt-1">
                      Use only for testing on local network
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={stopScanning}
                disabled={isProcessing}
                className="w-full h-12 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Stop Scanner"}
              </button>
            )}

            {/* Manual Input */}
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="text-center text-sm text-gray-600 mb-3">
                Or enter QR code manually:
              </p>
              <form onSubmit={handleManualInput} className="flex gap-2">
                <input
                  type="text"
                  value={scannedData}
                  onChange={(e) => setScannedData(e.target.value)}
                  placeholder="Enter user phone number"
                  disabled={isLoading || isProcessing}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#E38533] focus:border-transparent outline-none disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || isProcessing}
                  className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading || isProcessing ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-xl text-center font-semibold ${
                  message.includes("❌")
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : message.includes("📷")
                    ? "bg-blue-100 border border-blue-400 text-blue-700"
                    : "bg-green-100 border border-green-400 text-green-700"
                }`}
              >
                {message}
                {message.includes("❌") && !message.includes("Session expired") && (
                  <div className="mt-2 text-sm">
                    <p>Troubleshooting tips:</p>
                    <ul className="text-left list-disc list-inside mt-1">
                      {message.includes("HTTPS") && (
                        <li>Make sure you&apos;re using HTTPS or localhost</li>
                      )}
                      {message.includes("supported") && (
                        <li>
                          Try using a modern browser like Chrome, Safari,
                          Firefox, or Edge
                        </li>
                      )}
                      {message.includes("permission") && (
                        <li>
                          Allow camera permission when prompted by the browser
                        </li>
                      )}
                      <li>
                        Check if your device has a camera and it&apos;s not
                        being used by another app
                      </li>
                      <li>Try refreshing the page (F5)</li>
                      <li>
                        The scanner will automatically detect QR codes when they
                        appear in the camera view
                      </li>
                      <li>Use manual input as alternative</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-[90vw] shadow-2xl animate-bounce-in">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              ✅ Stamp Recorded Successfully!
            </h2>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">User:</span>
                <span className="font-semibold text-gray-800">
                  {successData.userName}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Sponsor:</span>
                <span className="font-semibold text-gray-800">
                  {successData.sponsorName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Stamps:</span>
                <span className="font-bold text-lg text-[#E38533]">
                  {successData.totalStamps} 🎫
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleScanNext}
                className="w-full bg-[#E38533] text-white py-3 rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg"
              >
                📷 Scan Next QR Code
              </button>
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}