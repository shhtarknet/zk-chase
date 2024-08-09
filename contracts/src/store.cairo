//! Store struct and component management methods.

// Core imports

use core::debug::PrintTrait;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Models imports

use zkchase::models::player::{Player, PlayerTrait};
use zkchase::models::game::{Game, GameTrait};
use zkchase::models::chaser::{Chaser, ChaserTrait};

/// Store struct.
#[derive(Copy, Drop)]
struct Store {
    world: IWorldDispatcher,
}

/// Implementation of the `StoreTrait` trait for the `Store` struct.
#[generate_trait]
impl StoreImpl of StoreTrait {
    #[inline]
    fn new(world: IWorldDispatcher) -> Store {
        Store { world: world }
    }

    #[inline]
    fn player(self: Store, player_id: felt252) -> Player {
        get!(self.world, player_id, (Player))
    }

    #[inline]
    fn game(self: Store, game_id: u32) -> Game {
        get!(self.world, game_id, (Game))
    }

    #[inline]
    fn chaser(self: Store, player_id: felt252, game_id: u32) -> Chaser {
        get!(self.world, (player_id, game_id), (Chaser))
    }

    #[inline]
    fn set_player(self: Store, player: Player) {
        set!(self.world, (player))
    }

    #[inline]
    fn set_game(self: Store, game: Game) {
        set!(self.world, (game))
    }

    #[inline]
    fn set_chaser(self: Store, chaser: Chaser) {
        set!(self.world, (chaser))
    }
}
