# OrangeCoin (ORANGE) 🍊

A comprehensive **SIP-010 compliant fungible token** built on the Stacks blockchain using Clarity smart contracts. OrangeCoin provides a robust foundation for tokenization projects with standard token functionality plus advanced features like minting, burning, and ownership management.

## 📋 Features

- **SIP-010 Compliant**: Fully implements the Stacks Improvement Proposal 010 for fungible tokens
- **Minting & Burning**: Owner can mint new tokens and users can burn their tokens
- **Access Control**: Owner-only functions with ownership transfer capability
- **Token Metadata**: Configurable token name, symbol, decimals, and URI
- **Comprehensive Testing**: Full test suite covering all functionality
- **Security**: Built-in checks for authorization, balance validation, and overflow protection

## 🚀 Quick Start

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) v3.7.0+
- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/orangecoin.git
   cd orangecoin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Check contract syntax**:
   ```bash
   clarinet check
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## 🔧 Contract API

### Token Information

- **Name**: OrangeCoin
- **Symbol**: ORANGE
- **Decimals**: 6
- **Standard**: SIP-010

### Core Functions

#### Read-Only Functions

```clarity
;; Get token name
(get-name) → (response string-ascii never)

;; Get token symbol  
(get-symbol) → (response string-ascii never)

;; Get token decimals
(get-decimals) → (response uint never)

;; Get balance of address
(get-balance (who principal)) → (response uint never)

;; Get total supply
(get-total-supply) → (response uint never)

;; Get token metadata URI
(get-token-uri) → (response (optional string-utf8) never)

;; Get contract owner
(get-owner) → (response principal never)
```

#### Public Functions

```clarity
;; Transfer tokens
(transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
→ (response bool uint)

;; Initialize contract with initial supply (owner only, one-time)
(initialize (initial-supply uint))
→ (response bool uint)

;; Mint tokens (owner only)
(mint (amount uint) (to principal))
→ (response bool uint)

;; Burn tokens
(burn (amount uint) (from principal))
→ (response bool uint)

;; Set token URI (owner only)
(set-token-uri (new-uri string-utf8))
→ (response bool uint)

;; Transfer ownership (current owner only)
(transfer-ownership (new-owner principal))
→ (response bool uint)
```

### Error Codes

| Code | Name | Description |
|------|------|-------------|
| 100 | ERR-OWNER-ONLY | Function can only be called by contract owner |
| 101 | ERR-NOT-TOKEN-OWNER | Sender is not authorized to transfer tokens |
| 102 | ERR-INSUFFICIENT-BALANCE | Insufficient token balance for operation |
| 103 | ERR-INVALID-AMOUNT | Amount must be greater than zero |
| 104 | Already initialized | Contract has already been initialized |

## 🧪 Testing

The project includes a comprehensive test suite covering:

- Contract initialization
- Token transfers and authorization
- Minting and burning operations
- Ownership management
- Error conditions and edge cases

**Run all tests**:
```bash
npm test
```

**Run with coverage** (if configured):
```bash
npm run test:coverage
```

## 🚀 Deployment

### Local Development

1. **Start Clarinet console**:
   ```bash
   clarinet console
   ```

2. **Deploy to local testnet**:
   ```clarity
   ::deploy_contracts
   ```

3. **Initialize the contract**:
   ```clarity
   (contract-call? .orangecoin initialize u1000000000000) ;; 1M tokens with 6 decimals
   ```

### Testnet Deployment

1. **Configure testnet settings** in `settings/Testnet.toml`

2. **Deploy to testnet**:
   ```bash
   clarinet deployments generate --testnet
   clarinet deployments apply -p testnet
   ```

### Mainnet Deployment

1. **Configure mainnet settings** in `settings/Mainnet.toml`

2. **Deploy to mainnet** (use with caution):
   ```bash
   clarinet deployments generate --mainnet
   clarinet deployments apply -p mainnet
   ```

## 📁 Project Structure

```
orangecoin/
├── contracts/
│   └── orangecoin.clar          # Main token contract
├── tests/
│   └── orangecoin.test.ts       # Comprehensive test suite
├── settings/
│   ├── Devnet.toml             # Local development settings
│   ├── Testnet.toml            # Testnet deployment settings
│   └── Mainnet.toml            # Mainnet deployment settings
├── Clarinet.toml               # Project configuration
├── package.json                # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── vitest.config.js           # Test configuration
└── README.md                  # This file
```

## 🔒 Security Considerations

- **Owner Controls**: The contract owner has privileged access to minting and configuration functions
- **Transfer Authorization**: Only token owners or authorized parties can transfer tokens
- **Balance Validation**: All operations check for sufficient balances and valid amounts
- **Initialization**: Contract can only be initialized once to prevent supply manipulation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Clarity best practices
- Add tests for new functionality
- Update documentation as needed
- Run `clarinet check` before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [SIP-010 Fungible Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/)

## 🎯 Roadmap

- [ ] Add pausable functionality
- [ ] Implement token vesting
- [ ] Add multi-signature support
- [ ] Create web interface for token management
- [ ] Add liquidity pool integration

---

**Built with ❤️ using Clarinet and the Stacks blockchain** 🚀
 
