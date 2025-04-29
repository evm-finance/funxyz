import { ButtonsRow } from './components/ButtonsRow.jsx';
import { TokenCards } from './components/TokenCards.jsx';

function App() {
  return (
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "2rem" }}>
        <ButtonsRow />
        <TokenCards />
      </div>
  );
}

export default App;