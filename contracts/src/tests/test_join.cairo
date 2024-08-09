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
fn test_actions_join() {
    // [Setup]
    let (world, systems, context) = setup::spawn_game();
    let store = StoreTrait::new(world);

    // [Join]
    systems.actions.join(context.game_id);

    // [Assert] Game
    let game = store.game(context.game_id);
    assert(game.chasers.into() > 0_u256, 'Game chasers');

    // [Assert] Player
    let player = store.player(context.player_id);
    assert(player.game_id != 0, 'Player game id');

    // [Assert] Chaser
    let chaser = store.chaser(context.player_id, context.game_id);
    assert(chaser.invincible, 'Chaser invincible status');
}
