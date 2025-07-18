import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Events from "../pages/Events";
import News from "../pages/News";

function App() {
  return (
    // main wrapper biar react tau kalau ini multipage app
    <Router>
      {/* Routes: berisi semua definisi rute */}
      <Routes>
        {/* Layout buat templating */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
