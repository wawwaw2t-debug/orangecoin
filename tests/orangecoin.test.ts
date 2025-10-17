import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("OrangeCoin (ORANGE) Token Tests", () => {
  it("should initialize correctly", () => {
    // Check initial state
    const totalSupply = simnet.callReadOnlyFn("orangecoin", "get-total-supply", [], deployer);
    expect(totalSupply.result).toBeOk(simnet.types.uint(0));

    const tokenName = simnet.callReadOnlyFn("orangecoin", "get-name", [], deployer);
    expect(tokenName.result).toBeOk(simnet.types.ascii("OrangeCoin"));

    const tokenSymbol = simnet.callReadOnlyFn("orangecoin", "get-symbol", [], deployer);
    expect(tokenSymbol.result).toBeOk(simnet.types.ascii("ORANGE"));

    const decimals = simnet.callReadOnlyFn("orangecoin", "get-decimals", [], deployer);
    expect(decimals.result).toBeOk(simnet.types.uint(6));

    const owner = simnet.callReadOnlyFn("orangecoin", "get-owner", [], deployer);
    expect(owner.result).toBeOk(simnet.types.principal(deployer));
  });

  it("should allow owner to initialize with initial supply", () => {
    const initialSupply = 1000000; // 1M tokens with 6 decimals
    
    const initResult = simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(initialSupply)],
      deployer
    );
    
    expect(initResult.result).toBeOk(simnet.types.bool(true));
    
    // Check total supply after initialization
    const totalSupply = simnet.callReadOnlyFn("orangecoin", "get-total-supply", [], deployer);
    expect(totalSupply.result).toBeOk(simnet.types.uint(initialSupply));
    
    // Check deployer balance
    const deployerBalance = simnet.callReadOnlyFn(
      "orangecoin",
      "get-balance",
      [simnet.types.principal(deployer)],
      deployer
    );
    expect(deployerBalance.result).toBeOk(simnet.types.uint(initialSupply));
  });

  it("should prevent double initialization", () => {
    // First initialization
    simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(1000000)],
      deployer
    );
    
    // Second initialization should fail
    const secondInit = simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(500000)],
      deployer
    );
    
    expect(secondInit.result).toBeErr(simnet.types.uint(104));
  });

  it("should allow token transfers", () => {
    // Initialize first
    simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(1000000)],
      deployer
    );
    
    const transferAmount = 10000;
    
    // Transfer from deployer to wallet1
    const transferResult = simnet.callPublicFn(
      "orangecoin",
      "transfer",
      [
        simnet.types.uint(transferAmount),
        simnet.types.principal(deployer),
        simnet.types.principal(wallet1),
        simnet.types.none()
      ],
      deployer
    );
    
    expect(transferResult.result).toBeOk(simnet.types.bool(true));
    
    // Check balances after transfer
    const wallet1Balance = simnet.callReadOnlyFn(
      "orangecoin",
      "get-balance",
      [simnet.types.principal(wallet1)],
      deployer
    );
    expect(wallet1Balance.result).toBeOk(simnet.types.uint(transferAmount));
    
    const deployerBalance = simnet.callReadOnlyFn(
      "orangecoin",
      "get-balance",
      [simnet.types.principal(deployer)],
      deployer
    );
    expect(deployerBalance.result).toBeOk(simnet.types.uint(1000000 - transferAmount));
  });

  it("should prevent unauthorized transfers", () => {
    // Initialize and give wallet1 some tokens
    simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(1000000)],
      deployer
    );
    
    simnet.callPublicFn(
      "orangecoin",
      "transfer",
      [
        simnet.types.uint(10000),
        simnet.types.principal(deployer),
        simnet.types.principal(wallet1),
        simnet.types.none()
      ],
      deployer
    );
    
    // Try to transfer from wallet1 using wallet2 (unauthorized)
    const unauthorizedTransfer = simnet.callPublicFn(
      "orangecoin",
      "transfer",
      [
        simnet.types.uint(5000),
        simnet.types.principal(wallet1),
        simnet.types.principal(wallet3),
        simnet.types.none()
      ],
      wallet2  // wallet2 trying to move wallet1's tokens
    );
    
    expect(unauthorizedTransfer.result).toBeErr(simnet.types.uint(101)); // ERR-NOT-TOKEN-OWNER
  });

  it("should allow owner to mint tokens", () => {
    const mintAmount = 50000;
    
    const mintResult = simnet.callPublicFn(
      "orangecoin",
      "mint",
      [
        simnet.types.uint(mintAmount),
        simnet.types.principal(wallet1)
      ],
      deployer
    );
    
    expect(mintResult.result).toBeOk(simnet.types.bool(true));
    
    // Check wallet1 balance
    const wallet1Balance = simnet.callReadOnlyFn(
      "orangecoin",
      "get-balance",
      [simnet.types.principal(wallet1)],
      deployer
    );
    expect(wallet1Balance.result).toBeOk(simnet.types.uint(mintAmount));
    
    // Check total supply
    const totalSupply = simnet.callReadOnlyFn("orangecoin", "get-total-supply", [], deployer);
    expect(totalSupply.result).toBeOk(simnet.types.uint(mintAmount));
  });

  it("should prevent non-owner from minting", () => {
    const mintResult = simnet.callPublicFn(
      "orangecoin",
      "mint",
      [
        simnet.types.uint(50000),
        simnet.types.principal(wallet1)
      ],
      wallet1  // Non-owner trying to mint
    );
    
    expect(mintResult.result).toBeErr(simnet.types.uint(100)); // ERR-OWNER-ONLY
  });

  it("should allow token burning", () => {
    // Initialize and mint tokens
    simnet.callPublicFn(
      "orangecoin",
      "initialize",
      [simnet.types.uint(1000000)],
      deployer
    );
    
    const burnAmount = 10000;
    
    const burnResult = simnet.callPublicFn(
      "orangecoin",
      "burn",
      [
        simnet.types.uint(burnAmount),
        simnet.types.principal(deployer)
      ],
      deployer
    );
    
    expect(burnResult.result).toBeOk(simnet.types.bool(true));
    
    // Check deployer balance after burn
    const deployerBalance = simnet.callReadOnlyFn(
      "orangecoin",
      "get-balance",
      [simnet.types.principal(deployer)],
      deployer
    );
    expect(deployerBalance.result).toBeOk(simnet.types.uint(1000000 - burnAmount));
    
    // Check total supply after burn
    const totalSupply = simnet.callReadOnlyFn("orangecoin", "get-total-supply", [], deployer);
    expect(totalSupply.result).toBeOk(simnet.types.uint(1000000 - burnAmount));
  });

  it("should prevent burning more than balance", () => {
    // Give wallet1 some tokens
    simnet.callPublicFn(
      "orangecoin",
      "mint",
      [
        simnet.types.uint(1000),
        simnet.types.principal(wallet1)
      ],
      deployer
    );
    
    // Try to burn more than balance
    const burnResult = simnet.callPublicFn(
      "orangecoin",
      "burn",
      [
        simnet.types.uint(2000),  // More than the 1000 balance
        simnet.types.principal(wallet1)
      ],
      wallet1
    );
    
    expect(burnResult.result).toBeErr(simnet.types.uint(102)); // ERR-INSUFFICIENT-BALANCE
  });

  it("should allow owner to set token URI", () => {
    const newUri = "https://new-orangecoin.io/metadata.json";
    
    const setUriResult = simnet.callPublicFn(
      "orangecoin",
      "set-token-uri",
      [simnet.types.utf8(newUri)],
      deployer
    );
    
    expect(setUriResult.result).toBeOk(simnet.types.bool(true));
    
    // Check if URI was updated
    const tokenUri = simnet.callReadOnlyFn("orangecoin", "get-token-uri", [], deployer);
    expect(tokenUri.result).toBeOk(simnet.types.some(simnet.types.utf8(newUri)));
  });

  it("should allow ownership transfer", () => {
    const transferOwnershipResult = simnet.callPublicFn(
      "orangecoin",
      "transfer-ownership",
      [simnet.types.principal(wallet1)],
      deployer
    );
    
    expect(transferOwnershipResult.result).toBeOk(simnet.types.bool(true));
    
    // Check new owner
    const owner = simnet.callReadOnlyFn("orangecoin", "get-owner", [], deployer);
    expect(owner.result).toBeOk(simnet.types.principal(wallet1));
    
    // Original owner should no longer be able to mint
    const mintResult = simnet.callPublicFn(
      "orangecoin",
      "mint",
      [
        simnet.types.uint(1000),
        simnet.types.principal(wallet2)
      ],
      deployer
    );
    
    expect(mintResult.result).toBeErr(simnet.types.uint(100)); // ERR-OWNER-ONLY
    
    // New owner should be able to mint
    const newOwnerMint = simnet.callPublicFn(
      "orangecoin",
      "mint",
      [
        simnet.types.uint(1000),
        simnet.types.principal(wallet2)
      ],
      wallet1  // New owner
    );
    
    expect(newOwnerMint.result).toBeOk(simnet.types.bool(true));
  });
});
