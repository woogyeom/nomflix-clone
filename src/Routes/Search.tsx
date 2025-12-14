import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { getSearchResults, IGetSearchResult } from "../api";
import { styled } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import SearchSlider from "../Components/SearchSlider";
import MovieDetail from "../Components/MovieDetail";
import TVDetail from "../Components/TVDetail";

const Wrapper = styled.div`
	height: 100%;
	min-height: 100vh;
	overflow-x: hidden;
`;

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	opacity: 0;
	z-index: 2;
`;

const MovieModal = styled(motion.div)`
	display: flex;
	flex-direction: column;
	position: fixed;
	width: 60vw;
	height: 70vh;
	background-color: ${(props) => props.theme.black.darker};
	top: 10%;
	left: 0;
	right: 0;
	margin: 0 auto;
	z-index: 3;
	border-radius: 10px;
	overflow: hidden;
`;

const TVModal = styled(motion.div)`
	display: flex;
	flex-direction: column;
	position: fixed;
	width: 60vw;
	height: 70vh;
	background-color: ${(props) => props.theme.black.darker};
	top: 10%;
	left: 0;
	right: 0;
	margin: 0 auto;
	z-index: 3;
	border-radius: 10px;
	overflow: hidden;
`;

function Search() {
	const location = useLocation<{ layoutId: string }>();
	const history = useHistory();
	const keyword = new URLSearchParams(location.search).get("keyword");
	const bigMovieMatch = useRouteMatch<{ movieId: string }>(
		"/search/movies/:movieId"
	);
	const bigTVMatch = useRouteMatch<{ tvId: string }>("/search/tvs/:tvId");

	const { data, isLoading } = useQuery<IGetSearchResult>(
		["search", keyword],
		() => getSearchResults(keyword || "")
	);

	const onOverlayClicked = () => {
		history.push(`/search?keyword=${keyword}`);
	};

	console.log(bigMovieMatch);
	console.log(bigTVMatch);

	return (
		<Wrapper>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<SearchSlider title="검색 결과" data={data?.results || []} />

					<AnimatePresence>
						{(bigMovieMatch || bigTVMatch) && (
							<>
								<Overlay
									onClick={onOverlayClicked}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								{bigMovieMatch && (
									<MovieModal layoutId={location.state.layoutId}>
										<MovieDetail movieId={+bigMovieMatch.params.movieId} />
									</MovieModal>
								)}
								{bigTVMatch && (
									<TVModal layoutId={location.state.layoutId}>
										<TVDetail tvId={+bigTVMatch.params.tvId} />
									</TVModal>
								)}
							</>
						)}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default Search;
