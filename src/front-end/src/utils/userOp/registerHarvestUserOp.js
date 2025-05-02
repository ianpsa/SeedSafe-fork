import { Contract } from "ethers";
import HarvestManagerAbi from "../../abi/abiHarvest.json";
import { getUserOperationClient } from "./userOpClient";
import { getSimpleAccountBuilder } from "./userOpBuilder";
import { CONTRACT_ADDRESSES } from "../../config/neroConfig";

/**
 * Envia uma UserOperation para registrar uma safra
 */
export const registerHarvestUserOp = async (
  signer,
  { crop, quantity, price, deliveryDate, doc }
) => {
  const builder = await getSimpleAccountBuilder(signer);
  const contractAddress = CONTRACT_ADDRESSES.harvestManager;
  const contract = new Contract(contractAddress, HarvestManagerAbi);

  const calldata = contract.interface.encodeFunctionData("createHarvest", [
    crop,
    quantity,
    price,
    deliveryDate,
    doc
  ]);

  const userOp = await builder.execute(contractAddress, 0, calldata);
  const client = await getUserOperationClient();
  const res = await client.sendUserOperation(userOp);
  console.log("✅ UserOperation enviada:", res.userOpHash);
  return res.userOpHash;
};
