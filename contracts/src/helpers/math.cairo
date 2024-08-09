//! # Fast power algorithm

/// Calculate the base ^ power
/// using the fast powering algorithm
/// # Arguments
/// * ` base ` - The base of the exponentiation
/// * ` power ` - The power of the exponentiation
/// # Returns
/// * ` T ` - The result of base ^ power
/// # Panics
/// * ` base ` is 0
pub fn fast_power<
    T,
    +Div<T>,
    +Rem<T>,
    +Into<u8, T>,
    +Into<T, u256>,
    +TryInto<u256, T>,
    +PartialEq<T>,
    +Copy<T>,
    +Drop<T>
>(
    base: T, mut power: T
) -> T {
    assert!(base != 0_u8.into(), "fast_power: invalid input");

    let mut base: u256 = base.into();
    let mut result: u256 = 1;

    loop {
        if power % 2_u8.into() != 0_u8.into() {
            result *= base;
        }
        power = power / 2_u8.into();
        if (power == 0_u8.into()) {
            break;
        }
        base *= base;
    };

    result.try_into().expect('too large to fit output type')
}
