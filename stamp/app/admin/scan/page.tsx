"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminScan() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [message, setMessage] = useState("");
  const [scannerInstance, setScannerInstance] =
    useState<Html5QrcodeScanner | null>(null);

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

  const stopScanning = () => {
    setScanning(false);
    setScannerInstance(null);
  };

  const processQRCode = (data: string) => {
    // Here you would process the QR code data
    // For now, just display a success message
    setMessage(`✅ Stamp recorded for user: ${data}`);
    setScannedData("");

    // In a real implementation, you would:
    // 1. Parse the QR code data to get user phone
    // 2. Update the user's completed stamps in database
    // 3. Show success/error message
  };

  // Handle scanner initialization when scanning state changes
  useEffect(() => {
    if (scanning && !scannerInstance) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false // verbose
      );

      // Success callback
      const onScanSuccess = (decodedText: string) => {
        console.log("QR Code detected:", decodedText);
        setMessage(`✅ QR Code scanned: ${decodedText}`);
        processQRCode(decodedText);
        stopScanning();
      };

      // Error callback
      const onScanError = (errorMessage: string) => {
        // Ignore scan errors, only show camera errors
        console.log("Scan error:", errorMessage);
      };

      // Wait for DOM element to be ready
      let attempts = 0;
      const maxAttempts = 20;

      const initScanner = () => {
        const element = document.getElementById("qr-reader");
        if (element) {
          try {
            scanner.render(onScanSuccess, onScanError);
            setScannerInstance(scanner);
            setMessage("✅ Camera is ready! Point at QR code");
          } catch (renderError) {
            console.error("Error rendering scanner:", renderError);
            setMessage(
              `❌ Cannot start camera: ${
                renderError instanceof Error
                  ? renderError.message
                  : "Unknown error"
              }. Please use manual input.`
            );
            setScanning(false);
          }
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(initScanner, 100);
        } else {
          console.error("QR reader element not found after maximum attempts");
          setMessage(
            "❌ Camera initialization failed. Please refresh and try again."
          );
          setScanning(false);
        }
      };

      setTimeout(initScanner, 50);
    } else if (!scanning && scannerInstance) {
      // Clean up scanner when stopping
      scannerInstance.clear().catch(console.error);
    }
  }, [scanning, scannerInstance]);

  const startScanning = async (forceEnable = false) => {
    // Check if running on HTTPS or localhost (skip in development or force enable)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (
      !forceEnable &&
      !isDevelopment &&
      location.protocol !== "https:" &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
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
    router.push("/signin");
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
                <div id="qr-reader" className="w-full h-full"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white bg-black/50 px-4 py-2 rounded-full inline-block">
                    Camera Active - Point at QR Code
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
                  className="w-full h-12 bg-[#E38533] text-white rounded-full font-semibold hover:bg-[#aa6427] transition-colors shadow-lg"
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
                className="w-full h-12 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
              >
                Stop Scanner
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
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#E38533] focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                >
                  Submit
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
                {message.includes("❌") && (
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
    </div>
  );
}
