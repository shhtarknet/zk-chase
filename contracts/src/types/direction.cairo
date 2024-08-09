// Errors

mod errors {
    const DIRECTION_INVALID: felt252 = 'Direction: is invalid';
}

#[derive(Copy, Drop)]
enum Direction {
    None,
    Up,
    Down,
    Left,
    Right,
}

#[generate_trait]
impl DirectionAssert of AssertTrait {
    #[inline]
    fn assert_is_valid(self: Direction) {
        assert(self != Direction::None.into(), errors::DIRECTION_INVALID);
    }
}

impl IntoDirectionFelt252 of core::Into<Direction, felt252> {
    #[inline(always)]
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::None => 'NONE',
            Direction::Up => 'UP',
            Direction::Down => 'DOWN',
            Direction::Left => 'LEFT',
            Direction::Right => 'RIGHT',
        }
    }
}

impl IntoDirectionU8 of core::Into<Direction, u8> {
    #[inline(always)]
    fn into(self: Direction) -> u8 {
        match self {
            Direction::None => 0,
            Direction::Up => 1,
            Direction::Down => 2,
            Direction::Left => 3,
            Direction::Right => 4,
        }
    }
}

impl IntoU8Direction of core::Into<u8, Direction> {
    #[inline(always)]
    fn into(self: u8) -> Direction {
        let card: felt252 = self.into();
        match card {
            0 => Direction::None,
            1 => Direction::Up,
            2 => Direction::Down,
            3 => Direction::Left,
            4 => Direction::Right,
            _ => Direction::None,
        }
    }
}

impl PartialEqDirection of core::PartialEq<Direction> {
    #[inline(always)]
    fn eq(lhs: @Direction, rhs: @Direction) -> bool {
        let left: u8 = (*lhs).into();
        let right: u8 = (*rhs).into();
        left == right
    }
}

impl DirectionPrint of core::debug::PrintTrait<Direction> {
    #[inline(always)]
    fn print(self: Direction) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
