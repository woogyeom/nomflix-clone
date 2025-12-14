import { useQuery } from "react-query";
import { getMoviesNP, getMoviesTR, getMoviesU, IGetMoviesResult } from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "./../utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import MovieDetail from "../Components/MovieDetail";
import MovieSlider from "../Components/MovieSlider";

const Wrapper = styled.div`
	height: 100%;
	overflow-x: hidden;
`;

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string | null }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: end;
	/* align-items: center; */
	padding: 60px;
	padding-bottom: 200px;
	background-image: linear-gradient(
			to bottom,
			rgba(19, 19, 19, 0) 0%,
			rgba(19, 19, 19, 0) 40%,
			rgba(19, 19, 19, 0.2) 50%,
			rgba(19, 19, 19, 0.4) 60%,
			rgba(19, 19, 19, 0.7) 75%,
			rgba(19, 19, 19, 0.9) 100%
		),
		url(${(props) => props.$bgPhoto});

	background-size: cover;
`;

const Title = styled.h2`
	font-size: 84px;
	font-weight: 600;
	margin-bottom: 20px;
`;

const OverView = styled.p`
	font-size: 28px;
	font-weight: 500;
	line-height: 1.3;
	width: 50%;
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

function Home() {
	const history = useHistory();
	const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

	const { data: dataNP, isLoading: isLoadingNP } = useQuery<IGetMoviesResult>(
		["movies", "nowPlaying"],
		getMoviesNP
	);
	const { data: dataTR, isLoading: isLoadingTR } = useQuery<IGetMoviesResult>(
		["movies", "topRated"],
		getMoviesTR
	);
	const { data: dataU, isLoading: isLoadingU } = useQuery<IGetMoviesResult>(
		["movies", "upcoming"],
		getMoviesU
	);

	const location = useLocation<{ layoutId: string }>();

	const onOverlayClicked = () => {
		history.push("/");
	};

	return (
		<Wrapper>
			{isLoadingNP || isLoadingTR || isLoadingU ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Banner
						$bgPhoto={makeImagePath(dataNP?.results[0].backdrop_path || "")}
					>
						<Title>{dataNP?.results[0].title}</Title>

						<OverView>{dataNP?.results[0].overview}</OverView>
					</Banner>

					<MovieSlider
						title="현재 상영 중"
						data={dataNP?.results.slice(1) || []}
					/>
					<MovieSlider title="최고 평점" data={dataTR?.results || []} />
					<MovieSlider title="업커밍" data={dataU?.results || []} />

					<AnimatePresence>
						{bigMovieMatch && (
							<>
								<Overlay
									onClick={onOverlayClicked}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								<MovieModal layoutId={location.state.layoutId}>
									<MovieDetail movieId={+bigMovieMatch.params.movieId} />
								</MovieModal>
							</>
						)}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default Home;
