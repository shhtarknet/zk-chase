import "hash.circom";
import "move.circom";

template Main () {
    // public for Cairo contract assert equivalence
    // To make sure bushes are same in Cairo and the circuit
    signal input map;

    // public for Cairo contract to compare against the prev pos
    signal output prev_pos_hash;
    signal input prev_pos; // private

    // public for Cairo contract to store in state for next iteration
    signal output new_pos_hash;
    
    signal input move_x; // private
    signal input move_y; // private

    signal input salt; // private

    // Step 1: Output prev public hash
    component prevHasher = Hash ();
    prevHasher.salt <== salt;
    prevHasher.val <== prev_pos;
    prev_pos_hash <== prevHasher.out;

    // Step 2: Validate move is 1,0 or 0,1 or -1,0 or 0,-1
	component validateMove = ValidateMove ();
    validateMove.move_x <== move_x;
    validateMove.move_y <== move_y;

    log("prev_pos: ", prev_pos);
    // Previous position
    var px = prev_pos \ 0x10000;
    var py = prev_pos % 0x10000;
    log("px: ", px, "py: ", py);
    // New position
    var x = px + move_x;
    var y = py + move_y;
    log("x: ", x, "y: ", y);

    // @TODO verify new position is in a bush

    // // Step 3: Verify new position hash matches the committed public hash
    // component currentHash = Hash ();
    // verifyCurrentHash.salt <== salt + 1;
    // // 
    // verifyCurrentHash.val <== newPosComponent.x;
    // new_pos_hash <== verifyCurrentHash.out;

    // Step <LAST>: Output new public hash
    component newHasher = Hash ();
    newHasher.salt <== salt;
    newHasher.val <== prev_pos \ 0x10000;
    // newHasher.val <== compress_pos(x, y);
    new_pos_hash <== newHasher.out;

}

component main { public [ map ] } = Main();

/* INPUT = {
    "map": "0011100",
    "prev_pos": "0x10001",
    "move_x": "1",
    "move_y": "0",
    "salt": "5674"
} */