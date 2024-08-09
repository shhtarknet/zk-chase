// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

// Interfaces

#[starknet::interface]
trait IActions<TContractState> {
    fn signup(self: @TContractState, name: felt252);
    fn rename(self: @TContractState, name: felt252);
    fn create(self: @TContractState) -> u32;
    fn join(self: @TContractState, game_id: u32);
    fn move(ref self: TContractState, direction: u8);
}

// Contracts

#[dojo::contract]
mod actions {
    // Component imports

    use zkchase::types::map::Map;
    use zkchase::types::direction::Direction;
    use zkchase::components::initializable::InitializableComponent;
    use zkchase::components::signable::SignableComponent;
    use zkchase::components::playable::PlayableComponent;

    // Local imports

    use super::IActions;

    // Components

    // component!(path: InitializableComponent, storage: initializable, event: InitializableEvent);
    // #[abi(embed_v0)]
    // impl WorldProviderImpl =
    //     InitializableComponent::WorldProviderImpl<ContractState>;
    // #[abi(embed_v0)]
    // impl DojoInitImpl = InitializableComponent::DojoInitImpl<ContractState>;
    component!(path: SignableComponent, storage: signable, event: SignableEvent);
    impl SignableInternalImpl = SignableComponent::InternalImpl<ContractState>;
    component!(path: PlayableComponent, storage: playable, event: PlayableEvent);
    impl PlayableInternalImpl = PlayableComponent::InternalImpl<ContractState>;

    // Storage

    #[storage]
    struct Storage {
        // #[substorage(v0)]
        // initializable: InitializableComponent::Storage,
        #[substorage(v0)]
        signable: SignableComponent::Storage,
        #[substorage(v0)]
        playable: PlayableComponent::Storage,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        // #[flat]
        // InitializableEvent: InitializableComponent::Event,
        #[flat]
        SignableEvent: SignableComponent::Event,
        #[flat]
        PlayableEvent: PlayableComponent::Event,
    }

    // Implementations

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn signup(self: @ContractState, name: felt252) {
            self.signable.signup(self.world(), name);
        }

        fn rename(self: @ContractState, name: felt252) {
            self.signable.rename(self.world(), name);
        }

        fn create(self: @ContractState) -> u32 {
            self.playable.create(self.world(), Map::Base)
        }

        fn join(self: @ContractState, game_id: u32) {
            self.playable.join(self.world(), game_id)
        }

        fn move(ref self: ContractState, direction: u8) {
            self.playable.move(self.world(), direction.into())
        }
    }
}
