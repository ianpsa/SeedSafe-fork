// src/userOp/registerHarvestUserOp.js
import { Contract, parseUnits } from "ethers";
import HarvestManagerAbi from "../../abi/abiHarvest.json";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES } from "../../config/neroConfig";

export const registerHarvestUserOp = async (
  signer,
  { crop, quantity, price, deliveryDate, doc }
) => {
  try {
    const contractAddress = CONTRACT_ADDRESSES.harvestManager;
    const builder = await getSimpleAccountBuilder(signer);

    const contract = new Contract(contractAddress, HarvestManagerAbi);
    const calldata = contract.interface.encodeFunctionData("createHarvest", [
      crop,
      quantity,
      parseUnits(String(price), 18),
      deliveryDate,
      doc,
    ]);

    const userOp = await builder.execute(contractAddress, 0, calldata);
    const client = await getUserOperationClient();
    const res = await client.sendUserOperation(userOp);

    console.log("✅ UserOperation enviada:", res.userOpHash);
    return res.userOpHash;
  } catch (err) {
    console.error("❌ Erro ao enviar UserOp:", err);
    throw err;
  }
};

