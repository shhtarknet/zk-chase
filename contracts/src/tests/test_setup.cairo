// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::{set_contract_address, set_transaction_hash};

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zkchase::store::{Store, StoreTrait};
use zkchase::models::game::{Game, GameTrait};
use zkchase::models::player::{Player, PlayerTrait};
use zkchase::models::chaser::{Chaser, ChaserTrait};
use zkchase::systems::actions::IActionsDispatcherTrait;

// Test imports

use zkchase::tests::setup::{setup, setup::{Systems, PLAYER}};

#[test]
fn test_actions_setup() {
    // [Setup]
    let (world, _, context) = setup::spawn_game();
    let store = StoreTrait::new(world);

    // [Assert]
    let game = store.game(context.game_id);
    assert(game.id == context.game_id, 'Game: id');
}
