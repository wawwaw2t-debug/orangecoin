;; OrangeBit (OBIT) - Simple fungible token with faucet

(define-constant TOKEN-NAME "OrangeBit")
(define-constant TOKEN-SYMBOL "OBIT")
(define-constant TOKEN-DECIMALS u6)

;; Supply caps (in base units, i.e. accounting for TOKEN-DECIMALS)
;; 1,000,000,000,000,000 units
(define-constant MAX-SUPPLY u1000000000000000)
;; per-principal mint limit
(define-constant FAUCET-LIMIT u1000000000)

;; Error codes
(define-constant ERR-INVALID-AMOUNT u400)
(define-constant ERR-FAUCET-LIMIT u401)
(define-constant ERR-INSUFFICIENT-BALANCE u402)

;; State
(define-data-var total-supply uint u0)
(define-map balances { account: principal } { balance: uint })
(define-map minted   { account: principal } { amount: uint })

;; Read-only views
(define-read-only (get-name)
  TOKEN-NAME)

(define-read-only (get-symbol)
  TOKEN-SYMBOL)

(define-read-only (get-decimals)
  TOKEN-DECIMALS)

(define-read-only (get-total-supply)
  (var-get total-supply))

(define-read-only (get-balance (who principal))
  (default-to u0 (get balance (map-get? balances { account: who }))))

(define-read-only (get-minted (who principal))
  (default-to u0 (get amount (map-get? minted { account: who }))))

;; Public functions
(define-public (transfer (recipient principal) (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let ((sender-bal (default-to u0 (get balance (map-get? balances { account: tx-sender })))) )
      (asserts! (>= sender-bal amount) (err ERR-INSUFFICIENT-BALANCE))
      (map-set balances { account: tx-sender } { balance: (- sender-bal amount) })
      (let ((rec-bal (default-to u0 (get balance (map-get? balances { account: recipient })))))
        (map-set balances { account: recipient } { balance: (+ rec-bal amount) }))
      (ok true))))

(define-public (faucet (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let (
      (current (default-to u0 (get amount (map-get? minted { account: tx-sender }))))
      (new     (+ current amount))
      (supply  (+ (var-get total-supply) amount))
    )
      (asserts! (<= new FAUCET-LIMIT) (err ERR-FAUCET-LIMIT))
      (asserts! (<= supply MAX-SUPPLY) (err ERR-INVALID-AMOUNT))
      (map-set minted { account: tx-sender } { amount: new })
      (let ((bal (default-to u0 (get balance (map-get? balances { account: tx-sender })))) )
        (map-set balances { account: tx-sender } { balance: (+ bal amount) }))
      (var-set total-supply supply)
      (ok true))))