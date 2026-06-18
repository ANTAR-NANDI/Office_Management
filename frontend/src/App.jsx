import { useEffect } from "react";
import axios from "axios";

function App() {

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Office Management System</h1>
    </div>
  );
}

export default App;