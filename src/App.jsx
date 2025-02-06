import "./App.css";
import Canvas from "./Canvas";
function App() {
  return (
    <>
      <Canvas width={window.innerWidth} height={window.innerHeight - 200} />
    </>
  );
}

export default App;
