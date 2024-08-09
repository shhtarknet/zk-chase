// Inernal imports

use zkchase::constants;
use zkchase::models::index::Player;

mod errors {
    const PLAYER_NOT_EXIST: felt252 = 'Player: does not exist';
    const PLAYER_ALREADY_EXIST: felt252 = 'Player: already exist';
    const INVALID_NAME: felt252 = 'Player: invalid name';
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline]
    fn new(id: felt252, name: felt252) -> Player {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);
        // [Return] Player
        Player { id, game_id: 0, name, }
    }

    #[inline]
    fn rename(ref self: Player, name: felt252) {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);
        // [Effect] Change the name
        self.name = name;
    }
}

#[generate_trait]
impl PlayerAssert of AssertTrait {
    #[inline]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), errors::PLAYER_NOT_EXIST);
    }

    #[inline]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), errors::PLAYER_ALREADY_EXIST);
    }
}

impl ZeroablePlayerImpl of core::Zeroable<Player> {
    #[inline]
    fn zero() -> Player {
        Player { id: 0, game_id: 0, name: 0 }
    }

    #[inline]
    fn is_zero(self: Player) -> bool {
        0 == self.name
    }

    #[inline]
    fn is_non_zero(self: Player) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{Player, PlayerTrait, AssertTrait};

    // Constants

    const PLAYER_ID: felt252 = 0xbeef;
    const PLAYER_NAME: felt252 = 'NAME';

    #[test]
    fn test_player_new() {
        let player = PlayerTrait::new(PLAYER_ID, PLAYER_NAME);
        assert_eq!(player.id, PLAYER_ID);
        assert_eq!(player.name, PLAYER_NAME);
    }

    #[test]
    fn test_player_rename() {
        let mut player = PlayerTrait::new(PLAYER_ID, PLAYER_NAME);
        player.rename('NEW_NAME');
        assert_eq!(player.name, 'NEW_NAME');
    }
}

