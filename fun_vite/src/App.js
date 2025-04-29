import { ButtonsRow } from '../vite-project/src/components/ButtonsRow';
import { TokenCards } from '../vite-project/src/components/TokenCards';

function App() {
  return (
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "2rem" }}>
        <ButtonsRow />
        <TokenCards />
      </div>
  );
}

export default App;