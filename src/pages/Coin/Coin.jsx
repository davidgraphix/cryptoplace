import React, { useState, useContext, useEffect } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null); // Set to null initially
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-bgJ4Z3UtSu7FJncmsWfJatLZ",
      },
    };

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`; // ✅ Use the correct endpoint
    console.log("Fetching:", url); // Debugging

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        console.log("Coin Data Fetched:", res); // Debugging
        setCoinData(res);
      })
      .catch((err) => console.error("Fetch Error:", err));
  };

  const fetchHistoricalData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-bgJ4Z3UtSu7FJncmsWfJatLZ",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        options
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency]);

  // **Fix: Handle loading state to prevent undefined errors**
  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image?.large} alt={coinData.name || "Coin"} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol?.toUpperCase()})
          </b>
        </p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>
      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>
            {currency.symbol} {coinData.market_cap_rank ?? "N/A"}
          </li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.current_price?.[
              currency.name
            ]?.toLocaleString() || "N/A"}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.market_cap?.[
              currency.name
            ]?.toLocaleString() || "N/A"}
          </li>
        </ul>
        <ul>
          <li>24 Hour low</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data?.low_24h?.[currency.name]?.toLocaleString() ||
              "N/A"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
