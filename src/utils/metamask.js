export const getCurrentAccount = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } else {
    throw new Error("MetaMask chưa được cài");
  }
};
