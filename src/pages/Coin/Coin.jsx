import React from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";

const Coin = () => {
  const { coinId } = useParams();
  return (
    <div>
      <h2>Coin : {coinId}</h2>
    </div>
  );
};

export default Coin;
