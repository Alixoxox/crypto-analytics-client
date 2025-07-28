export function assessRisk(asset) {
    const tags = [];

    const change = Math.abs(asset.price_change_percentage_24h || 0);
    const marketCap = asset.market_cap || 0;
    const volume = asset.total_volume || 0;
    const athDiff = Math.abs(asset.ath_change_percentage || 0);
    const rank = asset.market_cap_rank || 999;
    const volumeRatio = marketCap > 0 ? volume / marketCap : 0;
    const price = asset.current_price || 0;

    // --- STABLECOIN DETECTION (Overrides Volatility/Stable) ---
    const isStablecoin = change < 0.2 && price > 0.95 && price < 1.05;
    if (isStablecoin) {
      tags.push("Stablecoin");
    } else {
      // --- VOLATILITY ---
      if (change < 1.5) {
        tags.push("Stable");
      } else if (change > 5) {
        tags.push("Volatile");
      }
    }

    // --- VOLUME ---
    if (volumeRatio > 0.15) {
      tags.push("High Volume");
    } else if (volumeRatio < 0.005) {
      tags.push("Low Volume");
    }

    // --- RECOVERY ---
    if (athDiff > 50 && change > 1.5 && volumeRatio > 0.02) {
      tags.push("Recovery");
    }

    // --- RISK LEVEL (Assign only one) ---
    if (rank <= 10 && change < 2 && volumeRatio > 0.01) {
      tags.push("Low Risk");
    } else if (rank > 50 || athDiff > 80 || change > 10) {
      tags.push("High Risk");
    } else {
      tags.push("Medium Risk");
    }

    return tags;
  }
export const riskTypes = [
  "Stable",
  "Volatile",
  "High Volume",
  "Low Volume",
  "Recovery",
  "Stablecoin",
  "Low Risk",
  "Medium Risk",
  "High Risk"
];
function isJwtExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return exp < now;
  } catch (err) {
    return true; // consider invalid or corrupted token as expired
  }
}
export const checktoken = () => {
  const token = localStorage.getItem("jwt");
  if (!token || isJwtExpired(token)) {
    localStorage.removeItem("jwt");
    return null;
  }
}
