#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Player {
    #[key]
    id: felt252,
    game_id: u32,
    name: felt252,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    id: u32,
    map_id: u8,
    treasury: u8,
    chasers: felt252,
    seed: felt252,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Chaser {
    #[key]
    player_id: felt252,
    #[key]
    game_id: u32,
    position: u8,
    alive: bool,
    invincible: bool,
    kill_count: u32,
    treasury_count: u32,
}
