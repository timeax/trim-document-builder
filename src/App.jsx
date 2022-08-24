import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from "./routes";
import Footer from "./components/Section/Footer";
import Contestants from "./layouts/Contestants";
import { useState, useEffect } from "react";
import Context from "./context";
import Vote from "./layouts/Vote";


function App() {
  const [contestants, setContestants] = useState([]);
  const [user, setUser] = useState({});
  //-----
  useEffect(() => {
    fetch('/getContestants').then(res => {
      res.json().then(data => setContestants(data));
    });

    fetch('/getUserSession').then(res => {
      res.json().then(data => setUser(data));
    })

  }, [])

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });


  return (
    <Context.Provider value={{ contestants: contestants, user: [user, setUser] }}>
      <Router>
        <div className="App">
          <Header routes={routes} />
          <Routes>
            {getRoutes(routes)};
            <Route path="/vote" element={<Vote />} />
            <Route exact path='/contestants/:id' element={<Contestants />} />;
          </Routes>
          <Footer />
        </div>
      </Router>
    </Context.Provider>

  );
}

export default App;
