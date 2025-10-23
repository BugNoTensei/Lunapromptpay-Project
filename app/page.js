"use client";

import React, { useState, useEffect } from "react";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export default function PromptPayQR() {
  const [amount, setAmount] = useState("");
  const [idType, setIdType] = useState("mobile");
  const [idValue, setIdValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [shouldDivide, setShouldDivide] = useState(false);
  const [divideBy, setDivideBy] = useState("2");
  const [saveData, setSaveData] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedIdType = localStorage.getItem("promptpay_idType");
    const savedIdValue = localStorage.getItem("promptpay_idValue");
    const savedSaveData = localStorage.getItem("promptpay_saveData");

    if (savedSaveData === "true" && savedIdValue) {
      setIdType(savedIdType || "mobile");
      setIdValue(savedIdValue || "");
      setSaveData(true);
    }
  }, []);

  // Save data when checkbox is checked
  useEffect(() => {
    if (saveData && idValue) {
      localStorage.setItem("promptpay_idType", idType);
      localStorage.setItem("promptpay_idValue", idValue);
      localStorage.setItem("promptpay_saveData", "true");
    } else if (!saveData) {
      localStorage.removeItem("promptpay_idType");
      localStorage.removeItem("promptpay_idValue");
      localStorage.removeItem("promptpay_saveData");
    }
  }, [saveData, idType, idValue]);

  const calculateAmount = () => {
    if (!amount) return 0;
    const baseAmount = parseFloat(amount);
    if (shouldDivide && divideBy && parseInt(divideBy) > 0) {
      return baseAmount / parseInt(divideBy);
    }
    return baseAmount;
  };

  const generateQR = async () => {
    setError("");
    setQrCode("");

    const finalAmount = calculateAmount();

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("กรุณาใส่จำนวนเงินที่ถูกต้อง");
      return;
    }

    if (shouldDivide && (!divideBy || parseInt(divideBy) <= 0)) {
      setError("กรุณาใส่จำนวนคนที่ต้องการหารที่ถูกต้อง");
      return;
    }

    if (!idValue) {
      setError("กรุณาใส่เลขบัตรประชาชนหรือเบอร์โทรศัพท์");
      return;
    }

    // Validate ID format
    if (idType === "mobile") {
      const cleanMobile = idValue.replace(/\D/g, "");
      if (cleanMobile.length !== 10) {
        setError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
        return;
      }
    } else {
      const cleanId = idValue.replace(/\D/g, "");
      if (cleanId.length !== 13) {
        setError("เลขบัตรประชาชนต้องมี 13 หลัก");
        return;
      }
    }

    try {
      const cleanValue = idValue.replace(/\D/g, "");
      const payload = generatePayload(cleanValue, { amount: finalAmount });

      const qrDataUrl = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCode(qrDataUrl);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 300);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสร้าง QR Code: " + err.message);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleIdValueChange = (e) => {
    const value = e.target.value;
    if (/^[\d\s-]*$/.test(value)) {
      setIdValue(value);
    }
  };

  const handleDivideByChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setDivideBy(value);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 via-blue-600 to-cyan-500 px-8 py-6">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white/20 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">
              PromptPay QR
            </h1>
            <p className="text-blue-50 text-center mt-2 text-sm font-medium">
              สร้าง QR Code พร้อมเพย์ ง่ายๆ ด้วยตัวคุณเอง
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-5">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                💰 จำนวนเงิน (บาท)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3.5 text-lg font-semibold text-gray-800 placeholder-gray-400 bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-lg">
                  ฿
                </span>
              </div>
            </div>

            {/* Divide Option */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shouldDivide}
                    onChange={(e) => setShouldDivide(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-white border-2 border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm font-bold text-gray-800">
                    🧮 หารเงินเท่าๆ กัน
                  </span>
                </label>
              </div>

              {shouldDivide && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    หารกี่คน?
                  </label>
                  <input
                    type="text"
                    value={divideBy}
                    onChange={handleDivideByChange}
                    placeholder="2"
                    className="w-full px-4 py-2.5 text-base font-semibold text-gray-800 placeholder-gray-400 bg-white border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  {amount && divideBy && parseInt(divideBy) > 0 && (
                    <p className="mt-2 text-sm font-semibold text-purple-700 bg-white/70 rounded-lg px-3 py-2">
                      คนละ: ฿{calculateAmount().toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ID Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                📱 ประเภท
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIdType("mobile")}
                  className={`py-3.5 px-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    idType === "mobile"
                      ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300"
                      : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                  }`}
                >
                  📞 เบอร์โทร
                </button>
                <button
                  type="button"
                  onClick={() => setIdType("citizen")}
                  className={`py-3.5 px-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    idType === "citizen"
                      ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300"
                      : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                  }`}
                >
                  🆔 บัตรประชาชน
                </button>
              </div>
            </div>

            {/* ID Value Input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                {idType === "mobile" ? "📱 เบอร์โทรศัพท์" : "🆔 เลขบัตรประชาชน"}
              </label>
              <input
                type="text"
                value={idValue}
                onChange={handleIdValueChange}
                placeholder={
                  idType === "mobile" ? "0812345678" : "1234567890123"
                }
                maxLength={idType === "mobile" ? 12 : 17}
                className="w-full px-4 py-3.5 text-lg font-semibold text-gray-800 placeholder-gray-400 bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <p className="mt-2 text-xs font-semibold text-gray-600">
                {idType === "mobile"
                  ? "📏 ต้องมี 10 หลัก"
                  : "📏 ต้องมี 13 หลัก"}
              </p>
            </div>

            {/* Save Data Checkbox */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveData}
                  onChange={(e) => setSaveData(e.target.checked)}
                  className="w-5 h-5 text-green-600 bg-white border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-bold text-gray-800">
                  💾 จำข้อมูลของฉันไว้
                </span>
              </label>
              <p className="mt-2 ml-8 text-xs font-medium text-gray-600">
                ข้อมูลจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณเท่านั้น
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-linear-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl px-4 py-3 shadow-sm">
                <p className="text-sm font-bold text-red-700">⚠️ {error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateQR}
              className="w-full bg-linear-to-r from-blue-500 via-blue-600 to-cyan-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-300 hover:shadow-xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200"
            >
              ✨ สร้าง QR Code
            </button>

            {/* QR Code Display */}
            {qrCode && (
              <div className="mt-6 bg-linear-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-6 text-center border-2 border-blue-200 shadow-lg">
                <div className="bg-white rounded-xl p-4 inline-block shadow-md">
                  <img
                    src={qrCode}
                    alt="PromptPay QR Code"
                    className="mx-auto"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {shouldDivide && (
                    <>
                      <p className="text-sm font-bold text-gray-700">
                        💵 ยอดเต็ม:{" "}
                        <span className="text-blue-600 text-lg">
                          ฿{parseFloat(amount).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        👥 หาร {divideBy} คน
                      </p>
                    </>
                  )}
                  <p className="text-base font-bold text-gray-800">
                    💰 จำนวนเงิน:{" "}
                    <span className="text-blue-600 text-2xl">
                      ฿{calculateAmount().toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs font-semibold text-gray-600 mt-3 bg-yellow-100 rounded-lg px-3 py-2 inline-block">
                    📱 สแกน QR Code เพื่อชำระเงิน
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-blue-100">
          <p className="text-center text-sm font-semibold text-gray-700">
            🔒 ข้อมูลของคุณปลอดภัย
          </p>
          <p className="text-center text-xs font-medium text-gray-600 mt-1">
            ไม่มีการเก็บหรือส่งข้อมูลออกจากเบราว์เซอร์
          </p>
        </div>
      </div>
    </div>
  );
}
