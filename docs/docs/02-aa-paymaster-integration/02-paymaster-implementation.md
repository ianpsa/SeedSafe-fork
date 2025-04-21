---
sidebar_position: 2
custom_edit_url: null
---

# Detailed implementation of NERO Paymaster

## Introduction

&emsp;This section explains how the **NERO Chain Paymaster** system will be used within the **Seed Safe** platform. Based on the ERC-4337 (Account Abstraction) infrastructure, the Paymaster allows users to perform transactions **without paying gas fees**, enabling a **smooth, accessible, and inclusive** Web3 experience.

## What is the Paymaster and How It Will Be Used

&emsp;The Paymaster is a component of ERC-4337 responsible for **covering the gas costs** of UserOperations. Seed Safe will use the **pre-built Paymaster provided by NERO Chain**, **eliminating the need for a custom contract**.

This setup enables the platform to offer:
- **100% gasless** transactions for farmers and investors  
- User onboarding **without requiring token balances**  
- Direct integration with NERO’s infrastructure, with no technical friction

## Integrated Architecture with NERO Paymaster

| Component                    | Technical Role                                                                |
|-----------------------------|-------------------------------------------------------------------------------|
| **AA Wallet (Smart Account)** | Signs and constructs the user’s UserOperation                                |
| **UserOp SDK**               | Uses the AA platform API to fetch Paymaster data and build UserOps            |
| **NERO Paymaster**           | Sponsors the UserOperation sent to the EntryPoint                             |
| **Bundlers (NERO)**          | Forwards UserOps for on-chain execution                                       |
| **EntryPoint Contract**      | Executes the UserOperation after validation and gas sponsorship               |
| **Seed Safe Smart Contract** | Executes the requested transaction logic                                      |

## Flow of a Gasless Transaction

```mermaid
graph TD
    A[User clicks an action in the dApp] --> B[Smart Account initiates UserOp]
    B --> C[SDK call to AA Platform API using dev API Key]
    C --> D[UserOperation built using Paymaster data]
    D --> E[UserOperation sent to Bundler]
    E --> F[Bundler forwards to EntryPoint]
    F --> G[EntryPoint queries NERO Paymaster]
    G --> H[Paymaster covers the gas fee]
    H --> I[Seed Safe contract executes the function]
    I --> J[User receives the result (no fees paid)]
```

> 💡 **Note:** Step `C` is essential and occurs on the front end through an **API call to the AA Platform**, using the developer’s **API Key** to retrieve Paymaster permissions and configuration.

## How the Paymaster Will Be Funded

&emsp;Although Seed Safe uses a pre-built Paymaster from NERO, there will be an **indirect sustainability model** based on:

- Fees applied to commercial operations (e.g., crop token purchases)  
- Revenue collected through the `AgriFinance.sol` contract  
- Future use of this fund to **subsidize the Paymaster**, establish partnerships, or obtain sponsorships

&emsp;This model ensures the system remains **scalable and financially viable**, even with high transaction volumes.

## Practical Example

1. Ana decides to purchase 100 kg of crops  
2. The action triggers a UserOperation via the SDK, with data from NERO's API  
3. The operation is sent to the Bundler, which forwards it to the EntryPoint  
4. The EntryPoint queries NERO’s Paymaster  
5. The Paymaster approves and covers the gas cost  
6. The `SeedSafe` contract executes the transaction  
7. Ana receives the tokens and certificates **without paying any fees**

## Security

&emsp;Gasless flow security is ensured by:

- Internal validations by the NERO Paymaster  
- Permissions configured via the AA Platform (API Key)  
- Use of public, auditable smart contracts  
- Access limited only to specific Seed Safe functions  

## Integration Steps

1. Integrate a compatible AA SDK (e.g., StackUp, Alchemy)  
2. Automatically create Smart Accounts when users access the platform  
3. Configure Paymaster usage via API Key within the SDK  
4. Test functions such as `buyToken`, `mintCombo` via UserOperation  
5. Monitor Paymaster consumption and performance  

## Conclusion

&emsp;Using the **NERO Chain Paymaster** allows Seed Safe to scale its Web3 solution without requiring users to purchase tokens for gas. Through **Account Abstraction**, efficient architecture, and sustainability via internal contracts, the platform delivers a **modern, inclusive, and user-centered** experience.

## Bibliography
- SINGH, Aniket Kumar et al. Account abstraction via singleton entrypoint contract and verifying paymaster. In: 2023 2nd International Conference on Edge Computing and Applications (ICECAA). IEEE, 2023. p. 1598-1605.
- OJOG, Silviu; MIRON, Alina-Andrea. Account Abstraction: The Key to Blockchain Reporting. Informatica Economica, v. 28, n. 3, p. 73-81, 2024.
- WANG, Qin; CHEN, Shiping. Account abstraction, analysed. In: 2023 IEEE International Conference on Blockchain (Blockchain). IEEE, 2023. p. 323-331.