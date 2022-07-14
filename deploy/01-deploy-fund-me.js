//exportng function directly

const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

//when `yarn hardhat deploy` script ran, it automatically pas the `hre` arguement
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    //if you are on local or hardhat network, use the mock price feed
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    //if you are on mainnet, use the real price feed
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args: [ethUsdPriceFeedAddress],
  });
  log(`Contract deployed on ${network.name}!`);
  log("----------------------- ");
};

module.exports.tags = ["all", "fundme"];
