// Component

#[starknet::component]
mod PlayableComponent {
    // Core imports

    use core::debug::PrintTrait;

    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::get_caller_address;
    use starknet::storage::Map as StorageMap;

    // Dojo imports

    use dojo::world::IWorldDispatcher;
    use dojo::world::IWorldDispatcherTrait;

    // Internal imports

    use zkchase::constants;
    use zkchase::store::{Store, StoreTrait};
    use zkchase::types::direction::Direction;
    use zkchase::types::map::Map;
    use zkchase::models::game::{Game, GameTrait, GameAssert};
    use zkchase::models::player::{Player, PlayerTrait, PlayerAssert};
    use zkchase::models::chaser::{Chaser, ChaserTrait, ChaserAssert};

    // Errors

    mod errors {}

    // Storage

    #[storage]
    struct Storage {
        chaser_positions: StorageMap<(u32, u8), felt252>,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[generate_trait]
    impl InternalImpl<
        TContractState, +HasComponent<TContractState>
    > of InternalTrait<TContractState> {
        fn create(self: @ComponentState<TContractState>, world: IWorldDispatcher, map: Map) -> u32 {
            // [Setup] Datastore
            let store: Store = StoreTrait::new(world);

            // [Effect] Create game
            let game_id: u32 = world.uuid() + 1;
            let mut game = GameTrait::new(game_id, map, game_id.into());
            game.start();
            store.set_game(game);

            // [Return] Game id
            game_id
        }

        fn join(self: @ComponentState<TContractState>, world: IWorldDispatcher, game_id: u32) {
            // [Setup] Datastore
            let store: Store = StoreTrait::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Check] Player not already in game
            let player_chaser = store.chaser(player.id, player.game_id);
            player_chaser.assert_not_exists();

            // [Check] Game exists
            let mut game = store.game(game_id);
            game.assert_exists();

            // [Check] Chaser does not exist or is dead
            let chaser = store.chaser(player.id, game_id);
            chaser.assert_not_exists();

            // [Effect] Create chaser
            let position = game.spawn_chaser_position();
            let chaser = ChaserTrait::new(player.id, game_id, position);
            store.set_chaser(chaser);

            // [Effect] Update game
            store.set_game(game);

            // [Effect] Update player
            player.game_id = game_id;
            store.set_player(player);
        }

        fn move(
            ref self: ComponentState<TContractState>, world: IWorldDispatcher, direction: Direction
        ) {
            // [Setup] Datastore
            let store: Store = StoreTrait::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let player = store.player(caller.into());
            player.assert_exists();

            // [Check] Game exists
            let mut game = store.game(player.game_id);
            game.assert_exists();

            // [Check] Chaser exists and is not dead
            let mut chaser = store.chaser(player.id, player.game_id);
            chaser.assert_exists();

            // [Effect] Chaser move
            let position = chaser.position;
            let new_position = game.compute_next_position(position, direction);
            let is_busy = game.assess_busy(new_position);
            let is_treasury = game.assess_treasury(new_position);
            game.move(position, new_position);
            chaser.move(new_position);

            // [Effect] Assess kill
            if is_busy {
                // [Effect] Kill chaser
                let player_id = self.chaser_positions.read((player.game_id, new_position));
                let mut victim = store.chaser(player_id, player.game_id);
                // [Check] Victim is not invincible
                if !victim.invincible {
                    // [Effect] Kill the victim
                    victim.die();
                    // [Effect] Reward killer
                    chaser.kill();
                    // [Effect] Update killed chaser
                    store.set_chaser(victim);
                }
            }

            // [Effect] Update chaser positions
            self.chaser_positions.write((player.game_id, position), 0);
            self.chaser_positions.write((player.game_id, new_position), player.id);

            // [Effect] Assess treasury
            if is_treasury {
                // [Effect] Relocate treasury
                game.treasury = game.spawn_treasury_position();
                // [Effect] Reward chaser
                chaser.reward();
            }

            // [Effect] Update chaser
            store.set_chaser(chaser);

            // [Effect] Update game
            store.set_game(game);
        }
    }
}
