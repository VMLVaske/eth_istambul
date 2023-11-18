function getConstants(chainId: number) {
  switch (chainId) {
    case 1:
      return {
        FACTORY_ADDRESS: "",
        GNOSIS_SERVICE: "https://safe-transaction-mainnet.safe.global/",
      };
    case 5:
      return {
        FACTORY_ADDRESS: "0xb32ee94d2eC5ECE811a0c863eB3Eb04ebF344b34",
        GNOSIS_SERVICE: "https://safe-transaction-goerli.safe.global/",
      };
    case 11155111:
      return {
        FACTORY_ADDRESS: "0x8Bbb962F72fFF10f7af891efBD67ee56552cf6a6",
        GNOSIS_SERVICE: "https://safe-transaction-sepolia.safe.global/",
      };
  }
}

module.exports = {
  getConstants,
};
