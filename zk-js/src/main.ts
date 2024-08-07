import './style.css'
import { proove } from '../lib/main.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>ZK client proof test</h1>
    <div class="card">
      <button id="proove" type="button">Proove</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

document.querySelector<HTMLButtonElement>('#proove')!.addEventListener('click', async () => {
  console.log('hi');
  let input = prompt("Input JSON:", `{"inputs":["311"]}`);
  await proove(JSON.parse(input!));
  console.log('proved');
})
