import * as snarkjs from "snarkjs";
import circuit_wasm_file from "./fixtures/poseidon.wasm";
import circuit_final_zkey_file from "./fixtures/poseidon.zkey";
import verification_key from "./fixtures/vk.json";

export async function proove(inputs: any) {
	const { proof, publicSignals } =
		await snarkjs.groth16.fullProve(inputs, circuit_wasm_file, circuit_final_zkey_file);

	console.log("Proof: ", proof);
	return { proof, publicSignals };
}