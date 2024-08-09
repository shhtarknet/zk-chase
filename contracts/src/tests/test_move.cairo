// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::{set_contract_address, set_transaction_hash};

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zkchase::store::{Store, StoreTrait};
use zkchase::types::direction::Direction;
use zkchase::models::game::{Game, GameTrait};
use zkchase::models::player::{Player, PlayerTrait};
use zkchase::models::chaser::{Chaser, ChaserTrait};
use zkchase::systems::actions::IActionsDispatcherTrait;

// Test imports

use zkchase::tests::setup::{setup, setup::{Systems, PLAYER, ANYONE}};

#[test]
fn test_actions_move_idle() {
    // [Setup]
    let (world, systems, context) = setup::spawn_game();
    let store = StoreTrait::new(world);

    // [Join]
    systems.actions.join(context.game_id);

    // [Move]
    let chaser = store.chaser(context.player_id, context.game_id);
    let initial = chaser.position;
    systems.actions.move(Direction::Up.into());

    // [Assert] Chaser
    let chaser = store.chaser(context.player_id, context.game_id);
    assert(!chaser.invincible, 'Chaser invincible status');
    assert(chaser.position != initial, 'Chaser new position');
}

#[test]
fn test_actions_move_kill() {
    // [Setup]
    let (world, systems, context) = setup::spawn_game();
    let store = StoreTrait::new(world);

    // [Join]
    set_contract_address(ANYONE());
    systems.actions.join(context.game_id);
    set_contract_address(PLAYER());
    systems.actions.join(context.game_id);

    // [Move]
    set_contract_address(ANYONE());
    systems.actions.move(Direction::Up.into());
    set_contract_address(PLAYER());
    systems.actions.move(Direction::Down.into());
    systems.actions.move(Direction::Down.into());

    // [Assert] Player
    let player_chaser = store.chaser(context.player_id, context.game_id);
    assert(player_chaser.kill_count == 1, 'Player kill count');
    assert(player_chaser.alive, 'Player alive status');

    // [Assert] Chaser
    let anyone_chaser = store.chaser(context.anyone_id, context.game_id);
    assert(anyone_chaser.kill_count == 0, 'Anyone kill count');
    assert(!anyone_chaser.alive, 'Anyone alive status');
}
