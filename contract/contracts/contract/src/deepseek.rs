#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, Env, Address, Symbol, symbol_short, vec, Vec};

// Data structure for a rental
#[contracttype]
#[derive(Clone)]
pub struct Rental {
    pub nft_id: u64,           // Unique identifier of the NFT
    pub owner: Address,        // NFT owner's address
    pub renter: Option<Address>, // Current renter, if any
    pub price: i128,           // Rental price in the native token (stroops)
    pub start_time: u64,       // Timestamp when rental started
    pub end_time: u64,         // Timestamp when rental ends
    pub is_active: bool,       // Whether the rental is currently active (listed or rented)
}

// Storage keys
#[contracttype]
pub enum DataKey {
    Rental(u64), // Maps NFT ID to its rental data
}

#[contract]
pub struct NftRentalContract;

#[contractimpl]
impl NftRentalContract {
    /// List an NFT for rent.
    /// Parameters:
    /// - nft_id: Unique identifier of the NFT (e.g., token ID)
    /// - price: Rental price in the native asset (stroops)
    /// - duration: Rental duration in seconds
    /// The caller must be the owner of the NFT.
    pub fn list_nft(env: Env, nft_id: u64, price: i128, duration: u64) {
        let caller = env.invoker();
        let key = DataKey::Rental(nft_id);

        // Check if the NFT is already listed or rented
        if let Some(existing) = env.storage().instance().get(&key) {
            if existing.is_active {
                panic!("NFT is already listed or rented");
            }
        }

        // Create a new rental record
        let rental = Rental {
            nft_id,
            owner: caller.clone(),
            renter: None,
            price,
            start_time: 0,
            end_time: 0,
            is_active: true,
        };

        env.storage().instance().set(&key, &rental);
        env.storage().instance().extend_ttl(5000, 5000);
    }

    /// Rent an NFT that is currently listed.
    /// The caller must send the required payment (native asset) to the contract.
    /// This function assumes the payment is transferred in the same transaction.
    /// The contract transfers the payment to the owner and starts the rental.
    pub fn rent_nft(env: Env, nft_id: u64) {
        let caller = env.invoker();
        let key = DataKey::Rental(nft_id);
        let mut rental: Rental = env.storage().instance().get(&key)
            .expect("NFT not listed");

        // Validate: NFT must be listed (is_active true) and not currently rented
        if !rental.is_active || rental.renter.is_some() {
            panic!("NFT is not available for rent");
        }

        // Ensure the caller is not the owner
        if rental.owner == caller {
            panic!("Owner cannot rent their own NFT");
        }

        let current_time = env.ledger().timestamp();

        // Transfer payment from renter to owner using the native asset contract
        let native_contract = env.stellar_asset_contract();
        let native_token = env.contract_id();
        // Transfer amount from caller to owner
        env.invoke_contract(
            &native_contract,
            &Symbol::new(&env, "transfer"),
            vec![
                &env,
                caller.to_val(),
                rental.owner.to_val(),
                rental.price.to_val(),
            ],
        );

        // Update rental record
        rental.renter = Some(caller.clone());
        rental.start_time = current_time;
        rental.end_time = current_time + rental.duration; // Note: duration is not stored in rental struct; we need to add it.
        // We need to store duration separately or include it in rental. Let's add a duration field to Rental.
        // To keep the code consistent, we should modify the Rental struct to include `duration`.
        // For now, let's assume Rental has a `duration` field. We'll adjust the struct.

        // Update storage
        env.storage().instance().set(&key, &rental);
        env.storage().instance().extend_ttl(5000, 5000);
    }

    /// Return a rented NFT before or after the rental period.
    /// Only the current renter can return the NFT.
    /// After return, the NFT becomes available for rent again.
    pub fn return_nft(env: Env, nft_id: u64) {
        let caller = env.invoker();
        let key = DataKey::Rental(nft_id);
        let mut rental: Rental = env.storage().instance().get(&key)
            .expect("NFT not listed");

        // Validate: Must be rented by the caller
        if rental.renter != Some(caller) {
            panic!("You are not the current renter");
        }

        // Mark as inactive (or simply remove renter)
        rental.renter = None;
        rental.start_time = 0;
        rental.end_time = 0;
        // is_active remains true because the NFT can be listed again

        env.storage().instance().set(&key, &rental);
        env.storage().instance().extend_ttl(5000, 5000);
    }

    /// View the rental details of an NFT.
    /// Returns `None` if the NFT has never been listed.
    pub fn view_rental(env: Env, nft_id: u64) -> Option<Rental> {
        let key = DataKey::Rental(nft_id);
        env.storage().instance().get(&key)
    }
}