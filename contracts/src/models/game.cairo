// Core imports

use core::debug::PrintTrait;
use core::poseidon::{PoseidonTrait, HashState};
use core::hash::HashStateTrait;
use core::traits::TryInto;
use core::array::ArrayTrait;

// Inernal imports

use zkchase::constants;
use zkchase::types::direction::Direction;
use zkchase::types::map::{Map, MapTrait};
use zkchase::models::index::Game;
use zkchase::helpers::bitmap::Bitmap;

mod errors {
    const GAME_NOT_ENOUGH_ACTION: felt252 = 'Game: not enough action';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
}

#[generate_trait]
impl GameImpl of GameTrait {
    #[inline]
    fn new(id: u32, map: Map, seed: felt252) -> Game {
        Game { id, map_id: map.into(), treasury: 0, chasers: 0, seed: seed }
    }

    #[inline]
    fn start(ref self: Game) {
        self.treasury = self.spawn_treasury_position();
    }

    #[inline]
    fn reseed(self: Game) -> felt252 {
        let state: HashState = PoseidonTrait::new();
        let state = state.update(self.seed);
        let state = state.update(self.seed);
        state.finalize()
    }

    #[inline]
    fn move(ref self: Game, position: u8, new_position: u8) {
        // [Effect] Update chaser positions
        let bitmap: u256 = self.chasers.into();
        let bitmap: u256 = Bitmap::set_bit_at(bitmap, new_position, true);
        let bitmap: u256 = Bitmap::set_bit_at(bitmap, position, false);
        self.chasers = bitmap.try_into().unwrap();
    }

    #[inline]
    fn assess_busy(self: Game, position: u8) -> bool {
        // [Return] Kill status
        let bitmap: u256 = self.chasers.into();
        let is_busy = Bitmap::get_bit_at(bitmap, position);
        is_busy
    }

    #[inline]
    fn assess_treasury(ref self: Game, position: u8) -> bool {
        position == self.treasury
    }

    #[inline]
    fn compute_next_position(self: Game, position: u8, direction: Direction) -> u8 {
        let map: Map = self.map_id.into();
        map.move(position, direction)
    }

    #[inline]
    fn spawn_treasury_position(ref self: Game) -> u8 {
        // [Compute] New treasury position
        let map: Map = self.map_id.into();
        let position: u8 = map.treasury(self.chasers, self.seed);
        // [Effect] Update seed
        self.seed = self.reseed();
        // [Return] Treasury position
        position
    }

    #[inline]
    fn spawn_chaser_position(ref self: Game) -> u8 {
        // [Compute] New spawn position
        let map: Map = self.map_id.into();
        let position: u8 = map.spawn(self.seed);
        // [Effect] Update chaser positions
        let bitmap: u256 = self.chasers.into();
        self.chasers = Bitmap::set_bit_at(bitmap, position, true).try_into().unwrap();
        // [Effect] Update seed
        self.seed = self.reseed();
        // [Return] Spawn position
        position
    }
}

impl ZeroableGame of core::Zeroable<Game> {
    #[inline]
    fn zero() -> Game {
        Game { id: 0, map_id: 0, treasury: 0, chasers: 0, seed: 0, }
    }

    #[inline]
    fn is_zero(self: Game) -> bool {
        0 == self.seed
    }

    #[inline]
    fn is_non_zero(self: Game) -> bool {
        !self.is_zero()
    }
}

#[generate_trait]
impl GameAssert of AssertTrait {
    #[inline]
    fn assert_exists(self: Game) {
        assert(self.is_non_zero(), errors::GAME_NOT_EXISTS);
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::constants;
    use super::{Game, GameTrait, AssertTrait, Map, Direction};

    // Constants

    const GAME_ID: u32 = 1;
    const MAP: Map = Map::Base;
    const SEED: felt252 = 'SEED';

    #[test]
    fn test_game_new() {
        let game = GameTrait::new(GAME_ID, MAP, SEED);
        assert_eq!(game.id, GAME_ID);
        assert_eq!(game.map_id, MAP.into());
        assert_eq!(game.seed, SEED);
    }

    #[test]
    fn test_game_start() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        game.start();
        assert_eq!(game.treasury != 0, true);
    }

    #[test]
    fn test_game_reseed() {
        let game = GameTrait::new(GAME_ID, MAP, SEED);
        let new_seed = game.reseed();
        assert_eq!(new_seed != SEED, true);
    }

    #[test]
    fn test_game_move() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        game.chasers = 0b00000001;
        game.move(0, 1);
        assert_eq!(game.chasers, 0b00000010);
    }

    #[test]
    fn test_game_assess_busy() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        game.chasers = 0b00000001;
        assert_eq!(game.assess_busy(0), true);
        assert_eq!(game.assess_busy(1), false);
    }

    #[test]
    fn test_game_assess_treasury() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        game.treasury = 0;
        assert_eq!(game.assess_treasury(0), true);
        assert_eq!(game.assess_treasury(1), false);
    }

    #[test]
    fn test_game_compute_next_position() {
        let game = GameTrait::new(GAME_ID, MAP, SEED);
        let position = game.compute_next_position(1, Direction::Right);
        assert_eq!(position, 2);
    }

    #[test]
    fn test_game_spawn_treasury_position() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        let position = game.spawn_treasury_position();
        assert_eq!(position != 0, true);
    }

    #[test]
    fn test_game_spawn_chaser_position() {
        let mut game = GameTrait::new(GAME_ID, MAP, SEED);
        let position = game.spawn_chaser_position();
        assert_eq!(position != 0, true);
    }
}
