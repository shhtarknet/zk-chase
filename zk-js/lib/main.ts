import * as snarkjs from "snarkjs";
import circuit_wasm_file from "./fixtures/circuit.wasm";
import circuit_final_zkey_file from "./fixtures/circuit.zkey";
import verification_key from "./fixtures/vk.json";

export async function proove(inputs: any) {
	const { proof, publicSignals } =
		await snarkjs.groth16.fullProve(inputs, circuit_wasm_file, circuit_final_zkey_file);
	console.log(publicSignals, proof);
	const res = await snarkjs.groth16.verify(verification_key, publicSignals, proof);
	console.log(res);
	return { proof, publicSignals };
}

export async function verify(proof: any, publicSignals: any) {
	console.log(publicSignals, proof);
	return await snarkjs.groth16.verify(verification_key, publicSignals, proof);
}