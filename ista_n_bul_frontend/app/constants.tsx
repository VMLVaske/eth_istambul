function getConstants(chainId: number) {
  switch (chainId) {
    case 1:
      return {
        FACTORY_ADDRESS: "0x9f62EE65a8395824Ee0821eF2Dc4C947a23F0f25",
        GNOSIS_SERVICE: "https://safe-transaction-mainnet.safe.global/",
      };
    case 5:
      return {
        FACTORY_ADDRESS: "0xb32ee94d2eC5ECE811a0c863eB3Eb04ebF344b34",
        GNOSIS_SERVICE: "https://safe-transaction-goerli.safe.global/",
      };
    case 11155111:
      return {
        FACTORY_ADDRESS: "0xBBec230a501448024bEcD8fCb8c4D0d81Bb458B3",
        GNOSIS_SERVICE: "https://safe-transaction-sepolia.safe.global/",
      };
  }
}

export {
  getConstants,
};
