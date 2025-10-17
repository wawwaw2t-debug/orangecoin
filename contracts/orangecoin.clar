;; title: OrangeCoin (ORANGE) - A Fungible Token
;; version: 1.0.0
;; summary: OrangeCoin is a fungible token implementation on Stacks
;; description: A SIP-010 compliant fungible token with minting, burning, and transfer capabilities

;; OrangeCoin implements SIP-010 standard functions

;; Define the fungible token
(define-fungible-token orangecoin)

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-NOT-TOKEN-OWNER (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-AMOUNT (err u103))

;; Token metadata
(define-constant TOKEN-NAME "OrangeCoin")
(define-constant TOKEN-SYMBOL "ORANGE")
(define-constant TOKEN-DECIMALS u6)
(define-constant TOKEN-URI u"https://orangecoin.io/metadata.json")

;; Data variables
(define-data-var token-uri (string-utf8 256) TOKEN-URI)
(define-data-var contract-owner principal CONTRACT-OWNER)

;; SIP-010 Standard Functions

;; Transfer tokens
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq from tx-sender) (is-eq from contract-caller)) ERR-NOT-TOKEN-OWNER)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (ft-transfer? orangecoin amount from to)
  )
)

;; Get token name
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

;; Get token decimals
(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance orangecoin who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply orangecoin))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (some (var-get token-uri)))
)

;; Administrative Functions

;; Mint tokens (owner only)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-OWNER-ONLY)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (ft-mint? orangecoin amount to)
  )
)

;; Burn tokens
(define-public (burn (amount uint) (from principal))
  (begin
    (asserts! (or (is-eq from tx-sender) (is-eq tx-sender (var-get contract-owner))) ERR-NOT-TOKEN-OWNER)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= (ft-get-balance orangecoin from) amount) ERR-INSUFFICIENT-BALANCE)
    (ft-burn? orangecoin amount from)
  )
)

;; Set token URI (owner only)
(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-OWNER-ONLY)
    (var-set token-uri new-uri)
    (ok true)
  )
)

;; Transfer ownership (current owner only)
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-OWNER-ONLY)
    (var-set contract-owner new-owner)
    (ok true)
  )
)

;; Get contract owner
(define-read-only (get-owner)
  (ok (var-get contract-owner))
)

;; Initialize with initial supply (can only be called once by contract owner)
(define-public (initialize (initial-supply uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (asserts! (is-eq (ft-get-supply orangecoin) u0) (err u104)) ;; Already initialized
    (ft-mint? orangecoin initial-supply tx-sender)
  )
)
