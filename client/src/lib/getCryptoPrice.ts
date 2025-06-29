import axios from "axios";

export const getEthPrice = async (): Promise<number | null> => {
  if (!process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
    console.error("ETHERSCAN_API_KEY is not set in environment variables");
    return null;
  }
  
  try {
    const response = await axios.get("https://api.etherscan.io/v2/api", {
      params: {
        chainid: 1,
        module: "stats",
        action: "ethprice",
        apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1" && response.data.result) {
      return parseFloat(response.data.result.ethusd);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return null;
  }
};

// Utility function to convert USD to ETH
export const convertUsdToEth = (usdAmount: number, ethPrice: number): number => {
  return usdAmount / ethPrice;
};

// Utility function to format ETH amount
export const formatEthAmount = (ethAmount: number): string => {
  return ethAmount.toFixed(6);
};
