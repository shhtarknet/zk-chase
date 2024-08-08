include "circomlib/poseidon.circom";

template Hash () {
    signal input val;
    signal input salt;
    signal output out;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== val;
    hasher.inputs[1] <== salt;

    out <== hasher.out;
}