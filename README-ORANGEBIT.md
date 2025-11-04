# OrangeBit (OBIT)

A simple fungible token written in Clarity with a built‑in faucet for local development and demos. This project is a Clarinet workspace configured to compile and analyze the `orangebit` contract.

## Features

- Token metadata: name, symbol, decimals
- Balances and total supply tracking
- Transfer between principals
- Faucet with per‑principal mint limit
- Clarinet project configured in `Clarinet.toml`

## Contract

Path: `contracts/orangebit.clar`

Read‑only functions:
- `get-name` → string-ascii
- `get-symbol` → string-ascii
- `get-decimals` → uint
- `get-total-supply` → uint
- `get-balance (who principal)` → uint
- `get-minted (who principal)` → uint

Public functions:
- `transfer (recipient principal) (amount uint)` → (response bool uint)
- `faucet (amount uint)` → (response bool uint)

Constants:
- `TOKEN-DECIMALS` = 6
- `MAX-SUPPLY` (base units)
- `FAUCET-LIMIT` (per principal, base units)

Error codes:
- `u400` invalid amount
- `u401` faucet limit exceeded
- `u402` insufficient balance

## Getting Started

Prerequisites: Clarinet CLI v3.7+ installed (verify with `clarinet --version`).

- Check contracts:
  ```bash
  clarinet check
  ```
- Open console:
  ```bash
  clarinet console
  ```

Example console usage:
```clarity
;; mint from faucet to wallet_1
(contract-call? .orangebit faucet u1000)

;; transfer from wallet_1 to wallet_2
(contract-call? .orangebit transfer 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA u250)

;; read balances
(contract-call? .orangebit get-balance 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA)
```

## Project Structure

- `Clarinet.toml` – Clarinet configuration registering the `orangebit` contract
- `contracts/orangebit.clar` – Smart contract source
- `settings/` – Network configuration (Devnet/Testnet/Mainnet)
- `tests/` – Place JS/TS tests here if needed

## Development Tips

- Run `clarinet check` often to catch errors early
- Use `clarinet console` to interact locally
- Add tests with `@hirosystems/clarinet-sdk` and run via `npm test`
