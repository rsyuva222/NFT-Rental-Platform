#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, Symbol, symbol_short};

#[contracttype]
#[derive(Clone)]
pub struct Rental {
    pub owner: Address,
    pub renter: Address,
    pub price: u64,
    pub duration: u64,
    pub start_time: u64,
    pub is_rented: bool,
}

// Storage key
const RENTAL_KEY: Symbol = symbol_short!("RENT");

#[contract]
pub struct NFTRentalContract;

#[contractimpl]
impl NFTRentalContract {

    // 1. List NFT for rent
    pub fn list_nft(env: Env, owner: Address, price: u64, duration: u64) {
        let rental = Rental {
            owner: owner.clone(),
            renter: owner.clone(), // initially same
            price,
            duration,
            start_time: 0,
            is_rented: false,
        };

        env.storage().instance().set(&RENTAL_KEY, &rental);
    }

    // 2. Rent NFT
    pub fn rent_nft(env: Env, renter: Address) {
        let mut rental: Rental = env.storage().instance().get(&RENTAL_KEY).unwrap();

        if rental.is_rented {
            panic!("Already rented");
        }

        let time = env.ledger().timestamp();

        rental.renter = renter;
        rental.start_time = time;
        rental.is_rented = true;

        env.storage().instance().set(&RENTAL_KEY, &rental);
    }

    // 3. End rental (owner reclaims NFT)
    pub fn end_rental(env: Env) {
        let mut rental: Rental = env.storage().instance().get(&RENTAL_KEY).unwrap();

        if !rental.is_rented {
            panic!("Not rented");
        }

        let current_time = env.ledger().timestamp();

        if current_time < rental.start_time + rental.duration {
            panic!("Rental period not finished");
        }

        rental.renter = rental.owner.clone();
        rental.is_rented = false;
        rental.start_time = 0;

        env.storage().instance().set(&RENTAL_KEY, &rental);
    }

    // 4. View rental details
    pub fn view_rental(env: Env) -> Rental {
        env.storage().instance().get(&RENTAL_KEY).unwrap()
    }
}