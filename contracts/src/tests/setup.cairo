mod setup {
    // Core imports

    use core::debug::PrintTrait;

    // Starknet imports

    use starknet::ContractAddress;
    use starknet::testing::{set_contract_address, set_caller_address};

    // Dojo imports

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::utils::test::{spawn_test_world};

    // Internal imports

    use zkchase::models::index;
    use zkchase::models::game::{Game, GameTrait};
    use zkchase::models::player::Player;
    use zkchase::systems::actions::{actions, IActions, IActionsDispatcher, IActionsDispatcherTrait};

    // Constants

    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }

    fn ANYONE() -> ContractAddress {
        starknet::contract_address_const::<'ANYONE'>()
    }

    const PLAYER_NAME: felt252 = 'PLAYER';
    const ANYONE_NAME: felt252 = 'ANYONE';

    #[derive(Drop)]
    struct Systems {
        actions: IActionsDispatcher,
    }

    #[derive(Drop)]
    struct Context {
        player_id: felt252,
        anyone_id: felt252,
        player_name: felt252,
        anyone_name: felt252,
        game_id: u32,
    }

    #[inline(always)]
    fn spawn_game() -> (IWorldDispatcher, Systems, Context) {
        // [Setup] World
        let models = array![
            index::player::TEST_CLASS_HASH,
            index::game::TEST_CLASS_HASH,
            index::chaser::TEST_CLASS_HASH
        ];
        let world = spawn_test_world("zkchase", models);

        // [Setup] Systems
        let actions_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let systems = Systems {
            actions: IActionsDispatcher { contract_address: actions_address },
        };

        // [Setup] Context
        set_contract_address(ANYONE());
        systems.actions.signup(ANYONE_NAME);
        set_contract_address(PLAYER());
        systems.actions.signup(PLAYER_NAME);

        // [Setup] Game
        let game_id = systems.actions.create();
        let context = Context {
            player_id: PLAYER().into(),
            anyone_id: ANYONE().into(),
            player_name: PLAYER_NAME,
            anyone_name: ANYONE_NAME,
            game_id: game_id,
        };

        // [Return]
        (world, systems, context)
    }
}
