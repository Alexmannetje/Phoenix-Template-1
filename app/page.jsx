"use client";

import { theme } from "./theme";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [copied, setCopied] = useState(false);
  const [solanaPrice, setSolanaPrice] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [logoPositions, setLogoPositions] = useState([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(theme.coinAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const solanaResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        setSolanaPrice(solanaResponse.data.solana.usd);

        const tokenResponse = await fetch(
          `https://api.moonshot.cc/token/v1/solana/${theme.coinAddress}`,
          {
            method: "GET",
            headers: {},
          }
        );

        const tokenData = await tokenResponse.json();
        setTokenPrice(tokenData.priceUsd);
      } catch (error) {
        console.error("Error fetching prices:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const generateRandomPositions = () => {
      const positions = [];
      for (let i = 0; i < 100; i++) {
        const top = Math.floor(Math.random() * 85) + 5;
        const left = Math.floor(Math.random() * 85) + 5;
        positions.push({ top: `${top}%`, left: `${left}%`});
      }
      return positions;
    };

    setLogoPositions(generateRandomPositions());
  }, []);

  const conversionRate =
    solanaPrice && tokenPrice
      ? (solanaPrice / tokenPrice).toFixed(2)
      : null;

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        color: theme.textColor,
      }}
    >
      {logoPositions.map((pos, index) => (
        <img
          key={index}
          src={theme.logo}
          alt={`${theme.coinName} Logo`}
          className="absolute w-24 h-24 opacity-100"
          style={{ top: pos.top, left: pos.left, zIndex: 0 }}
        />
      ))}

      <div className="flex flex-col md:flex-row items-center justify-center max-w-7xl w-full bg-white/25 backdrop-blur-xl rounded-3xl shadow-2xl p-12 md:p-16 mb-12 relative z-10">
        <div className="flex flex-col items-center justify-center md:w-1/2 mb-12 md:mb-0">
          <img
            src={theme.logo || "/placeholder.svg"}
            alt={`${theme.coinSymbol} Logo`}
            className="w-full max-w-lg h-auto object-contain rounded-2xl mb-8"
          />
        </div>

        <div className="flex flex-col md:w-1/2 space-y-8 ml-12">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-center md:text-left mb-6"
            style={{ color: theme.textColor }}
          >
            {theme.coinName}
          </h1>
          <p
            className="text-xl text-center md:text-left mb-8"
            style={{ color: theme.textColor }}
          >
            {theme.coinDescription}
          </p>
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white/30 border border-white/50 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 block px-6 py-4 pr-28"
                style={{ color: theme.textColor }}
                value={theme.coinAddress}
                readOnly
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-md py-2 px-4 text-lg font-semibold transition-colors duration-200"
                style={{ color: theme.textColor }}
              >
                {copied ? (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          <div
            className="rounded-xl p-8 text-xl shadow-md bg-white/20 border border-white/30"
            style={{ color: theme.textColor }}
          >
            <p className="mb-6">
              <strong>Total supply:</strong> {formatNumber(theme.coinSupply)} {theme.coinSymbol}
            </p>
            <p className="mb-6">
              <strong>Live {theme.coinName} Price:</strong> ${tokenPrice ? formatNumber(tokenPrice) : "Loading..."}
            </p>
            <p className="mb-6">
              <strong>Live Solana Price:</strong> ${solanaPrice ? formatNumber(solanaPrice) : "Loading..."}
            </p>
            <p>
              <strong>Live Conversion Rate:</strong> 1 SOL = {conversionRate ? formatNumber(conversionRate) : "Loading..."} {theme.coinSymbol}
            </p>
          </div>

          <a
            href={theme.socialLinks.moonshot}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white/30 hover:bg-white/40 text-center text-white rounded-lg py-4 px-6 text-xl font-semibold transition-colors duration-200 mb-6"
            style={{ color: theme.textColor }}
          >
            Buy on Moonshot
          </a>

          <div className="flex justify-center space-x-6">
            <a
              href={theme.socialLinks.dexscreener}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-lg hover:scale-105 transition"
            >
              <img
                src="/dexscreener_icon.png"
                alt="Dexscreener"
                className="w-full h-full object-cover rounded-full"
              />
            </a>
            <a
              href={theme.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-lg hover:scale-105 transition"
            >
              <img
                src="/x_icon.png"
                alt="Twitter"
                className="w-full h-full object-cover rounded-full"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-lg p-10 mt-12 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          How to Buy {theme.coinName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <img
                src="/solana.png"
                alt="Solana"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">
              Step 1: Buy Solana
            </h3>
            <p className="text-gray-500">
              Purchase Solana (SOL) on your preferred cryptocurrency exchange
              (e.g., Binance, Coinbase).
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <img
                src="/phantom.png"
                alt="Phantom"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">
              Step 2: Transfer to Phantom Wallet
            </h3>
            <p className="text-gray-500">
              Send your SOL to your Phantom Wallet for secure storage and easy
              access.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <img
                src="/moonshot.png"
                alt="Moonshot"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">
              Step 3: Swap for {theme.coinName}
            </h3>
            <p className="text-gray-500">
              Use your Phantom Wallet to swap SOL for {theme.coinSymbol} via a
              moonshot.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-lg p-10 mt-12 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Tokenomics
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-10">
          <div className="w-80 h-80 relative mr-40">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#facc15"
                strokeWidth="3.8"
                strokeDasharray="80 20"
                strokeDashoffset="25"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="3.8"
                strokeDasharray="20 80"
                strokeDashoffset="45"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="3.8"
                strokeDasharray="2 98"
                strokeDashoffset="27"
              />
              <image
                href={theme.logo}
                x="4"
                y="4"
                height="28"
                width="28"
                clipPath="circle(14)"
              />
            </svg>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">80%</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-700">Presale</h3>
                <p className="text-gray-500">
                  Allocation for presale activities and initial distribution.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">18%</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-700">Liquidity</h3>
                <p className="text-gray-500">
                  Funds reserved for liquidity pools and market stabilization.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">2%</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-700">Burn</h3>
                <p className="text-gray-500">
                  Tokens allocated for burning to reduce supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
