---
sidebar_position: 1
custom_edit_url: null
---

# Overview of AA integration

## Introduction

&emsp;**Seed Safe** integrates the **Account Abstraction (ERC-4337)** model through the **NERO Chain** infrastructure, enabling **gasless, intuitive, and accessible** transactions for small farmers, investors, and stakeholders in the agro-environmental chain.

&emsp;This approach removes the barrier of requiring native tokens (such as ETH) to interact with smart contracts, while offering a scalable and secure architecture for complex operations like **crop tokenization, traceability, and carbon offsetting**.

## What is Account Abstraction and Why We Use It

&emsp;**Account Abstraction (AA)** allows user accounts to be **customizable smart contracts**, called **Smart Accounts**, instead of simple wallets controlled by private keys.

&emsp;At Seed Safe, we use AA to:

- Create wallets with programmable logic (no MetaMask required)  
- Allow users to interact without holding gas tokens  
- Enable a **gasless model** supported by NERO’s Paymaster  
- Facilitate onboarding for non-technical users with a Web2-like experience  

## How Seed Safe’s Architecture Connects with AA

### Simplified Usage Flow:

1. The user accesses the dApp and automatically creates a **Smart Account**  
2. When interacting (e.g., buying crops), a **UserOperation** is created  
3. The front-end makes a **call to the AA Platform (aa-platform API)** using the **developer’s configured API Key**  
4. The UserOperation is built with the Smart Account data and Paymaster permissions  
5. The operation is sent to a **Bundler**  
6. The Bundler forwards it to the **EntryPoint** on NERO Chain  
7. **NERO’s Paymaster** validates and covers the gas cost  
8. The **Seed Safe contract** executes the function normally  
9. The user receives the result — with **no fees paid**

### Components Used:

| Component         | Function                                                            |
|-------------------|---------------------------------------------------------------------|
| Smart Account      | Represents the user with signing and validation logic               |
| UserOperation      | Structure that packages the transaction                             |
| SDK + API Key      | Calls the AA Platform with Paymaster data                           |
| Bundler (NERO)     | Forwards operations to the network                                  |
| EntryPoint (NERO)  | Validates and executes operations with Paymaster support            |
| Paymaster (NERO)   | Sponsors the transaction's gas cost                                 |

## How the aa-platform Will Be Configured in the Project

&emsp;To enable Paymaster usage and automatic Smart Account creation, Seed Safe will integrate NERO’s **aa-platform** (or compatible ERC-4337 providers like StackUp or Alchemy) as follows:

1. **Create a developer account on the AA platform**  
2. **Generate a custom API Key**  
3. **Configure the SDK on Seed Safe’s front-end**, using the API Key and NERO as the target network  
4. Define authorized contracts and usage permissions (limits, methods, etc.)  
5. Test real operations (e.g., `buyToken`, `mintCombo`) in a test environment  
6. Monitor sponsored gas consumption and make adjustments as needed  

&emsp;This configuration ensures transparent Paymaster functionality, secure operations, and traceability of infrastructure usage.

## Practical Applications of AA in Seed Safe

&emsp;The AA architecture is integrated into the platform’s core operations, such as:

- **Purchasing crop tokens** (`buyToken`)  
- **Minting ESG certificates** (`mintCombo`)  
- **Recording harvests or total losses**  
- **Burning carbon credits** (`burn`)  
- **Distributing crops and automatic compensations**  

&emsp;These actions are packaged as **UserOperations** and executed gasless via NERO Chain infrastructure.

## Sustaining the Gasless Model

&emsp;Although Seed Safe **does not use a custom Paymaster**, the use of **NERO’s Paymaster** ensures gas coverage for end users. To support this model, the platform applies a **percentage-based fee (e.g., 2%) on commercial transactions**, accumulated in the `AgriFinance.sol` contract.

&emsp;This fund can later be used to:

- Subsidize the Paymaster  
- Support the maintenance of the gasless experience  
- Finance environmental compensation during agricultural cycles  

## Advantages of the AA Approach

- **Frictionless access**: anyone can interact even without tokens  
- **Automatic onboarding**: wallet created upon accessing the platform  
- **Web2-like experience**: asynchronous and intuitive transactions  
- **Programmable security**: customized logic through Smart Accounts  
- **Real scalability**: architecture ready for high-volume efficiency  

## Conclusion

&emsp;By integrating the **Account Abstraction infrastructure from NERO Chain** and properly configuring the **aa-platform with Paymaster**, Seed Safe ensures a **decentralized, accessible, and scalable** user experience — removing entry barriers for new users. This strategic architecture reinforces the platform’s core values of **inclusion, innovation, and sustainable impact**.

## Bibliography
- SINGH, Aniket Kumar et al. Account abstraction via singleton entrypoint contract and verifying paymaster. In: 2023 2nd International Conference on Edge Computing and Applications (ICECAA). IEEE, 2023. p. 1598-1605.
- OJOG, Silviu; MIRON, Alina-Andrea. Account Abstraction: The Key to Blockchain Reporting. Informatica Economica, v. 28, n. 3, p. 73-81, 2024.
- WANG, Qin; CHEN, Shiping. Account abstraction, analysed. In: 2023 IEEE International Conference on Blockchain (Blockchain). IEEE, 2023. p. 323-331.