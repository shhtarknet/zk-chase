use zkchase::types::direction::AssertTrait;
// External imports

use zkchase::helpers::deck::{Deck, DeckTrait};

// Internal imports

use zkchase::types::direction::Direction;
use zkchase::elements::maps;

// Errors

mod errors {
    const MAP_INVALID_POSITION: felt252 = 'Map: invalid position';
    const MAP_INVALID_DIRECTION: felt252 = 'Map: invalid direction';
}

#[derive(Copy, Drop)]
enum Map {
    None,
    Base,
}

#[generate_trait]
impl MapImpl of MapTrait {
    #[inline]
    fn size(self: Map) -> u32 {
        match self {
            Map::None => 0,
            Map::Base => maps::base::MapImpl::size(),
        }
    }

    #[inline]
    fn width(self: Map) -> u8 {
        match self {
            Map::None => 0,
            Map::Base => maps::base::MapImpl::width(),
        }
    }
    #[inline]
    fn height(self: Map) -> u8 {
        match self {
            Map::None => 0,
            Map::Base => maps::base::MapImpl::height(),
        }
    }

    #[inline]
    fn trees(self: Map) -> felt252 {
        match self {
            Map::None => 0,
            Map::Base => maps::base::MapImpl::trees(),
        }
    }

    #[inline]
    fn spawns(self: Map) -> felt252 {
        match self {
            Map::None => 0,
            Map::Base => maps::base::MapImpl::spawns(),
        }
    }

    #[inline]
    fn treasury(self: Map, excluded: felt252, seed: felt252) -> u8 {
        let spawns: felt252 = self.spawns();
        let trees: felt252 = self.trees();
        let bitmap: u256 = spawns.into() | trees.into() | excluded.into();
        let mut deck: Deck = DeckTrait::from_bitmap(seed, self.size(), bitmap);
        deck.draw() - 1
    }

    #[inline]
    fn spawn(self: Map, seed: felt252) -> u8 {
        let spawns: felt252 = self.spawns();
        let bitmap: u256 = ~spawns.into();
        let mut deck: Deck = DeckTrait::from_bitmap(seed, self.size(), bitmap);
        deck.draw() - 1
    }

    #[inline]
    fn move(self: Map, position: u8, direction: Direction) -> u8 {
        match direction {
            Direction::Up => self.move_up(position),
            Direction::Down => self.move_down(position),
            Direction::Left => self.move_left(position),
            Direction::Right => self.move_right(position),
            _ => 0,
        }
    }

    #[inline]
    fn move_up(self: Map, position: u8) -> u8 {
        // [Check] Allowed
        let width = self.width();
        assert(position >= width, errors::MAP_INVALID_POSITION);
        position - width
    }

    #[inline]
    fn move_down(self: Map, position: u8) -> u8 {
        // [Check] Allowed
        let width = self.width();
        assert(position.into() + width.into() < self.size(), errors::MAP_INVALID_POSITION);
        position + width
    }

    #[inline]
    fn move_left(self: Map, position: u8) -> u8 {
        // [Check] Allowed
        let width = self.width();
        assert(position % width != 0, errors::MAP_INVALID_POSITION);
        position - 1
    }

    #[inline]
    fn move_right(self: Map, position: u8) -> u8 {
        // [Check] Allowed
        let width = self.width();
        assert(position % width != width - 1, errors::MAP_INVALID_POSITION);
        position + 1
    }
}

impl IntoMapFelt252 of core::Into<Map, felt252> {
    #[inline(always)]
    fn into(self: Map) -> felt252 {
        match self {
            Map::None => 'NONE',
            Map::Base => 'BASE',
        }
    }
}

impl IntoMapU8 of core::Into<Map, u8> {
    #[inline(always)]
    fn into(self: Map) -> u8 {
        match self {
            Map::None => 0,
            Map::Base => 1,
        }
    }
}

impl IntoU8Map of core::Into<u8, Map> {
    #[inline(always)]
    fn into(self: u8) -> Map {
        let card: felt252 = self.into();
        match card {
            0 => Map::None,
            1 => Map::Base,
            _ => Map::None,
        }
    }
}

impl MapPrint of core::debug::PrintTrait<Map> {
    #[inline(always)]
    fn print(self: Map) {
        let felt: felt252 = self.into();
        felt.print();
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{Map, MapTrait};

    #[test]
    fn test_map_move_up() {
        let map: Map = Map::Base;
        let new: u8 = map.move_up(20);
        assert_eq!(new, 2);
    }

    #[test]
    fn test_map_move_down() {
        let map: Map = Map::Base;
        let new: u8 = map.move_down(2);
        assert_eq!(new, 20);
    }

    #[test]
    fn test_map_move_left() {
        let map: Map = Map::Base;
        let new: u8 = map.move_left(2);
        assert_eq!(new, 1);
    }

    #[test]
    fn test_map_move_right() {
        let map: Map = Map::Base;
        let new: u8 = map.move_right(1);
        assert_eq!(new, 2);
    }
}

