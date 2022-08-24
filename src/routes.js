import Home from "./layouts/Home";
import About from "./layouts/About";
import Contact from "./layouts/Contact";
import Registry from "./layouts/Registry";
import Records from "./layouts/Records";
import Contestants from "./layouts/Contestants";
const routes = [
    {
        name: 'Home',
        key: 'home',
        route: '/',
        component: <Home />
    },

    {
        name: 'About Us',
        key: 'about',
        route: '/about',
        component: <About />
    },

    {
        name: 'Contact',
        key: 'contact',
        route: '/contact',
        component: <Contact />
    },

    {
        name: 'Contestants',
        key: 'contestants',
        route: '/contestants',
        component: <Contestants />
    },
    
    {
        name: 'Live records',
        key: 'live_records',
        route: '/live_records',
        component: <Records />
    },
    {
        name: 'Login',
        key: 'login',
        route: '/login',
        component: <Registry />
    }
]

export default routes;