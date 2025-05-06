// src/userOp/registerHarvestUserOp.js
import { ethers } from "ethers";
import HarvestManagerAbi from "../../abi/abiHarvest.json";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../../config/neroConfig";

export const registerHarvestUserOp = async (
  signer,
  { crop, quantity, price, deliveryDate, doc }
) => {
  try {
    const contractAddress = CONTRACT_ADDRESSES.harvestManager;
    const builder = await getSimpleAccountBuilder(signer);

    const contract = new ethers.Contract(contractAddress, HarvestManagerAbi);
    const calldata = contract.interface.encodeFunctionData("createHarvest", [
      crop,
      quantity,
      ethers.utils.parseUnits(String(price), 18),
      deliveryDate,
      doc,
    ]);

    const userOp = await builder.execute(contractAddress, 0, calldata);

    console.log("UserOp gerada:", userOp);
    console.log("paymasterAndData final:", userOp.paymasterAndData);

    const client = await getUserOperationClient();
    const res = await client.sendUserOperation(userOp);

    console.log("UserOperation enviada:", res.userOpHash);
    return res.userOpHash;
  } catch (err) {
    console.error("Erro ao enviar UserOp:", err);
    throw err;
  }
};





