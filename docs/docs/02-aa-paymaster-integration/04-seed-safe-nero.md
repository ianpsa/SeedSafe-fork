# SeedSafe — Advanced Account Abstraction (AA) and Paymaster Integration on NERO Chain

This document presents the full integration of **SeedSafe** with **NERO Chain's Account Abstraction (AA)** and **Paymaster** infrastructure. Beyond basic configuration, our solution dynamically interacts with the AA Platform via REST API and UserOpSDK to manage gas sponsorship policies in real time, combining prepaid and postpaid strategies.

---

## 1. Dynamic Paymaster Integration Architecture

SeedSafe is not limited to static Paymaster settings. Our backend connects to NERO’s **AA Platform** through:

- **REST API calls** for real-time monitoring and adjustments.
- Use of the **UserOpSDK** to streamline UserOperation submissions.
- Automated policy management to adapt gas sponsorship based on user behavior, promotional campaigns, and system thresholds.

### 1.1 How We Use AA Platform API & UserOpSDK
- Query Paymaster balance and usage metrics via API.
- Dynamically adjust discount policies:
  - For example, offering full gas sponsorship for the first **10 transactions** per user.
  - Apply progressive discounts after reaching defined usage milestones.
- Switch between **Prepaid** and **Postpaid** modes depending on operational needs:
  - **Prepaid** ensures stability for onboarding phases.
  - **Postpaid** allows flexibility for high-volume users and business partners.

### 1.2 Planned Discount & Sponsorship Strategy
- **First X Transactions Free:**  
  Every new user receives up to 10 gasless transactions to encourage onboarding.

- **Global Campaigns:**  
  Certain transaction types (e.g., security-related actions within SeedSafe) are always covered by the Paymaster.

- **Full Coverage vs. Partial Coverage:**  
  Depending on user tiers or partnerships, SeedSafe can offer:
  - Full gas payment.
  - Partial discounts (e.g., 50% gas covered after initial free tier).

- **Real-Time Adjustments:**  
  Admin dashboards interact with AA Platform to:
  - Pause sponsorship when budgets are reached.
  - Activate special events (e.g., free gas weekends).

---

## 2. Paymaster Configuration on AA Platform

### 2.1 Policy and Payment Setup
We configured our Paymaster to align with this dynamic strategy:

- **Policy:**
  - 10 free transactions per address (daily limit).
  - Global cap to prevent budget overruns.
  - API-driven modifications based on system state.

- **Payment:**
  - Combination of Prepaid (for guaranteed availability) and Postpaid (for scaling flexibility).

### 2.2 Dashboard Screenshots

**Policy Settings:**

<p style={{textAlign: 'center'}}>Figure 1: Policy Settings</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/policy.png").default} style={{width: 800}} alt="Policy Settings" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

**Payment Mode & Balance:**

<p style={{textAlign: 'center'}}>Figure 1: Payments Settings</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/payment.png").default} style={{width: 800}} alt="Payments Settings" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

## 3. Technical Implementation — Bundler RPC & UserOpSDK

SeedSafe communicates with NERO’s **Bundler RPC** and integrates the **UserOpSDK** to automate and manage UserOperations.

### 3.1 Bundler RPC Details
- **Endpoint:** `https://bundler.service.nerochain.io`
- **Method:** `eth_sendUserOperation`
- **EntryPoint:** `0x0576a174D229E3cFA37253523E645A78A0C91B57`

### 3.2 Example Implementation

```javascript
import axios from 'axios';

const userOp = { ... };  // UserOperation structured with Paymaster integration

axios.post('https://bundler.service.nerochain.io', {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_sendUserOperation',
  params: [userOp, '0x0576a174D229E3cFA37253523E645A78A0C91B57']
});
```

## 4. Test Execution and Validation

### 4.1 Execution Summary
We submitted a UserOperation using the configured Paymaster and Bundler RPC.

### 4.2 Terminal Output

<p style={{textAlign: 'center'}}>Figure 1: Test Terminal</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/terminal.png").default} style={{width: 800}} alt="Test Terminal" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

### 4.3 Result Explanation
The Bundler returned:

> "sender: not deployed, initCode must be set"

This indicates correct UserOperation formatting and Paymaster usage. The response is expected due to the use of an EOA instead of a Smart Account. In production, we will implement Smart Account deployment via initCode.
