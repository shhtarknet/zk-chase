// Internal imports

#[derive(Drop, Copy)]
trait MapTrait {
    fn size() -> u32;
    fn width() -> u8;
    fn height() -> u8;
    fn trees() -> felt252;
    fn spawns() -> felt252;
}
