import './style.css'
import { proove, verify } from '../lib/main.ts'

let proof: any | null = null;
let publicSignals: any | null = null;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>ZK client proof test</h1>
    <div class="card">
      <button id="proove" type="button">Generate proof</button>
      <button id="verify" style="display:none" type="button">Verify proof</button>
    </div>
    <pre id="proof">
      Click Generate proof above.
    </pre>
  </div>
`

let $verify: HTMLButtonElement | null = document.querySelector('#verify')
let $proove: HTMLButtonElement | null = document.querySelector('#proove')

$verify!.addEventListener('click', async () => {
  if (proof && publicSignals) {
    let verified = await verify(proof, publicSignals);
    alert(verified ? 'Proof verified' : 'Proof not verified');
  }
})

function utilPrintJSON(jsonOb: any) {
  return JSON.stringify(jsonOb).replace(/\{/g, '{\n').replace(/\,"/g, ',\n"').replace(/\],/g, '],\n').replace(/\}/g, '\n}');
}

$proove!.addEventListener('click', async () => {
  console.log('hi');
  let input = prompt("Input JSON:", `{"inputs":["311"]}`);
  // setting global vars to be used in verify
  ({ proof, publicSignals } = await proove(JSON.parse(input!)));

  document.getElementById("proof")!.innerText = `Proof:\n${utilPrintJSON(proof)}\n\nPublic Signals:\n${utilPrintJSON(publicSignals)}`;
  $verify!.style.display = 'inline-block';

})
