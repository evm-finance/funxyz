import { ButtonsRow } from './components/ButtonsRow';
import { TokenCards } from './components/TokenCards';

function App() {
  return (
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "2rem" }}>
        <ButtonsRow />
        <TokenCards />
      </div>
  );
}

export default App;