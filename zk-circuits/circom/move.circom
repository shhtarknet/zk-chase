
template ValidateMove () {
    signal input move_x;
    signal input move_y;

    assert(move_x == 0 || move_y == 0); // assert one of the moves is zero
    assert(move_x + move_y == 1 || move_x + move_y == -1); // move is 1 or -1
}

function compress_pos(x, y) {
    return x * 0x10000 + y;
}

template CompressPosition () {
    signal input x;
    signal input y;
    signal output pos;

    // position from x and y
    pos <== x * 0x10000 + y;
    log("x", x, ", y", y);
}

// template ProcessMove (map, prev_pos, move) {
//     signal x;
//     // get the new position
//     component posFromDir = NewPositionFromDirection(prev_pos, move);

//     x <== posFromDir.x;

//     // assert new position in a bush
//     // verify new position commitment
// }