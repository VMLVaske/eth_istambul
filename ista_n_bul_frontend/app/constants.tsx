function getConstants(chainId: number) {
  switch (chainId) {
    case 1:
      return {
        FACTORY_ADDRESS: "",
        GNOSIS_SERVICE: "https://safe-transaction-mainnet.safe.global/",
      };
    case 5:
      return {
        FACTORY_ADDRESS: "0x9f62EE65a8395824Ee0821eF2Dc4C947a23F0f25",
        GNOSIS_SERVICE: "https://safe-transaction-goerli.safe.global/",
      };
  }
}

module.exports = {
  getConstants,
};
