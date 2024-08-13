use std::hash::keccak256;

global COLS = 18;
global ROWS = 14;

// hashes two inputs
fn hash(val: Field, salt: Field) -> Field {
    std::hash::mimc::mimc_bn254([val, salt])
}

fn expand_position(position: Field) -> (u8, u8) {
    let pos_bytes = position.to_be_bytes(2);
    let mut px = pos_bytes[0];
    let mut py = pos_bytes[1];
    (px, py)
}

fn compress_position(x: u8, y: u8) -> Field {
    (x as u64 + y as u64 * 256 as u64) as Field
}

fn make_move(prev_pos: Field, move: u8) -> (u8, u8) {
    let (mut px, mut py) = expand_position(prev_pos);

    if move == 1 {
        py += 1;
    } else if move == 2 {
        py -= 1;
    } else if move == 3 {
        px -= 1;
    } else if move == 4 {
        px += 1;
    } else {
        assert(false, "Invalid move");
    }
    (py, px)
}

// Get map bit at x, y
fn map_bit(map0: U128, map1: U128, x: u8, mut y: u8) -> u8 {
    let mut map = map0;
    let mut bit: u8 = y * COLS + x;

    // print("bit[ ");
    // print(bit);

    // We have a map in two U128, m0 and m1
    // determine which one to use base on the row (y)
    if bit > 125 {
        bit = bit - 126;
        map = map1;
    }
    // Now use map.lo or map.hi if bit value to fetch is greater than 63
    let mut map_part = map.lo as u64;
    let mut total_bits: u8 = 63;
    // print(" ~ ");
    // print(bit);
    if bit > 63 {
        map_part = map.hi as u64;
        bit -= 64;
        total_bits = 61;
    }

    // bits to drop, everything after the reqd bit
    let mut drop_bits = bit;
    // print(" ] ");
    let divide_drop_bits: u64 = 1 << (drop_bits);
    // divide by power of two to drop lower bits
    let remainder_map = map_part / divide_drop_bits;
    // drop higher bits
    let bit = remainder_map % 2;

    bit as u8
}

// Main game circuit
// map: public for Cairo contract to assert equivalence
//      and that bushes are correct places in Cairo and the circuit
// prev_pos_hash: public for Cairo contract to compare against the prev pos
// prev_pos: private previous position (before playing move)
// move: between 1, 2, 3, 4 for moving UP, DOWN, LEFT, RIGHT
// salt: for hashing
// returns: public new position hash output for Cairo contract to store in state for next iteration
fn main(
    map0: pub U128,
    map1: pub U128,
    prev_pos_hash: pub Field,
    prev_pos: Field,
    move: u8,
    salt: Field //
) -> pub Field {
    // public for Cairo contract assert equivalence
    // To make sure bushes are same in Cairo and the circuit

    // Step 1: Output prev public hash
    assert(hash(prev_pos, salt) == prev_pos_hash);

    // Step 2: Process move
    let (x, y) = make_move(prev_pos, move);

    // Step 3: Assert move is in the bush
    assert(1 == map_bit(map0, map1, x, y));

    // Step 4: Output new public hash
    let pos = compress_position(x, y);
    println(pos);

    hash(pos, salt)
}

mod test {
    use crate::{main, map_bit, hash};
    /*
     000110011100110000
     001110011100111000
     001110000000011110
     001100111111001111
     011101111111100111
     111001110011100000
     110001100001100000
    */
    global MAP1 = U128::from_integer(8572555389858747807877673192308021344);

    /*
     000001100001100011
     000001110011100111
     111001111111101110
     111100111111001100
     011110000000011100
     000111001110011100
     000011001110011000
    */
    global MAP0 = U128::from_integer(2025978491129711385918832679433810840);

    #[test]
    fn test_bush() {
        let rows = [
            [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
            [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
            [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]
        ];

        for y in 0..14 {
            // println("");
            // print("printing row: ");
            // println(y);
            let row = rows[y];
            for i in 0..18 {
                // let i = 17 - i;
                // print(i);
                // print(" : ");
                let bit = map_bit(MAP0, MAP1, i, y);
                // print(bit);
                if bit == row[i] {
                    // print(" == ");
                } else {
                    // print(" != ");
                }
                // println(row[i]);
                // assert(row[17 - i] == bit);
            }
        }
    }

    #[test]
    fn test_main() {
        let salt = 2134924215;

        let prev_pos = 0x705;
        let prev_pos_hash = hash(prev_pos, salt);
        let move = 2;
        let result = main(MAP1, MAP0, prev_pos_hash, prev_pos, move, salt);
        assert(result == hash(0x704, salt));
    }
}
