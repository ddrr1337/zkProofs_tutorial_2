const networkConfig = {
  31337: {
    name: "localhost",
  },

  11155111: {
    name: "sepolia",
    ORACLE_ROUTER_ADDRESS: "0x485c587Cc4a72EA4bD8395ACec6ee0ee2263c1d9",
    ORACLE_GRID_ADDRESS: "0x34F581f4c417119172c2C0a2572F09071F11e294",
    USD_ADDRESS: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    verify: true,
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
