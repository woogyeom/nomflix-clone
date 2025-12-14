import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import TV from "./Routes/TV";

function App() {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path={["/tvs", "/tvs/:tvsId"]}>
					<TV />
				</Route>
				<Route path={["/search", "/search/movies/:id", "/search/tvs/:id"]}>
					<Search />
				</Route>
				<Route path={["/", "/movies/:moviesId"]}>
					<Home />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
