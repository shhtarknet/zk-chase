use core::zeroable::Zeroable;
// Internal imports

use zkchase::models::index::Chaser;

mod errors {
    const CHASER_NOT_EXIST: felt252 = 'Chaser: does not exist';
    const CHASER_ALREADY_EXIST: felt252 = 'Chaser: already exist';
    const INVALID_NAME: felt252 = 'Chaser: invalid name';
}

#[generate_trait]
impl ChaserImpl of ChaserTrait {
    #[inline]
    fn new(player_id: felt252, game_id: u32, position: u8) -> Chaser {
        // [Return] Chaser
        Chaser {
            player_id,
            game_id,
            position,
            alive: true,
            invincible: true,
            kill_count: 0,
            treasury_count: 0
        }
    }

    #[inline]
    fn move(ref self: Chaser, position: u8) {
        // [Effect] Turn off invincibility
        self.invincible = false;
        // [Effect] Change the position
        self.position = position;
    }

    #[inline]
    fn kill(ref self: Chaser) {
        // [Effect] Increment the kill count
        self.kill_count += 1;
    }

    #[inline]
    fn die(ref self: Chaser) {
        // [Effect] Update dead status
        self.alive = false;
    }

    #[inline]
    fn reward(ref self: Chaser) {
        // [Effect] Increment the treasury count
        self.treasury_count += 1;
    }
}

#[generate_trait]
impl ChaserAssert of AssertTrait {
    #[inline]
    fn assert_exists(self: Chaser) {
        assert(self.is_non_zero(), errors::CHASER_NOT_EXIST);
    }

    #[inline]
    fn assert_not_exists(self: Chaser) {
        assert(self.is_zero(), errors::CHASER_ALREADY_EXIST);
    }
}

impl ZeroableChaserImpl of core::Zeroable<Chaser> {
    #[inline]
    fn zero() -> Chaser {
        Chaser {
            player_id: 0,
            game_id: 0,
            position: 0,
            alive: false,
            invincible: false,
            kill_count: 0,
            treasury_count: 0
        }
    }

    #[inline]
    fn is_zero(self: Chaser) -> bool {
        !self.is_non_zero()
    }

    #[inline]
    fn is_non_zero(self: Chaser) -> bool {
        self.alive
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{Chaser, ChaserTrait, AssertTrait};

    // Constants

    const PLAYER_ID: felt252 = 0xbeef;
    const GAME_ID: u32 = 1;
    const POSITION: u8 = 1;

    #[test]
    fn test_chaser_new() {
        let chaser = ChaserTrait::new(PLAYER_ID, GAME_ID, POSITION);
        assert_eq!(chaser.player_id, PLAYER_ID);
        assert_eq!(chaser.game_id, GAME_ID);
        assert_eq!(chaser.position, POSITION);
        assert_eq!(chaser.alive, true);
        assert_eq!(chaser.invincible, true);
        assert_eq!(chaser.kill_count, 0);
        assert_eq!(chaser.treasury_count, 0);
    }

    #[test]
    fn test_chaser_move() {
        let mut chaser = ChaserTrait::new(PLAYER_ID, GAME_ID, POSITION);
        chaser.move(POSITION + 1);
        assert_eq!(chaser.invincible, false);
        assert_eq!(chaser.position, POSITION + 1);
    }

    #[test]
    fn test_chaser_kill() {
        let mut chaser = ChaserTrait::new(PLAYER_ID, GAME_ID, POSITION);
        chaser.kill();
        assert_eq!(chaser.kill_count, 1);
    }

    #[test]
    fn test_chaser_die() {
        let mut chaser = ChaserTrait::new(PLAYER_ID, GAME_ID, POSITION);
        chaser.die();
        assert_eq!(chaser.alive, false);
    }

    #[test]
    fn test_chaser_reward() {
        let mut chaser = ChaserTrait::new(PLAYER_ID, GAME_ID, POSITION);
        chaser.reward();
        assert_eq!(chaser.treasury_count, 1);
    }
}

