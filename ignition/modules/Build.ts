import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Build", (m) => {
    const build = m.contract("Escrow");

    return { build };
});