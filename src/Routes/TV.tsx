import { useQuery } from "react-query";
import { getTVsAT, getTVsP, getTVsTR, IGetTVsResult } from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import TVSlider from "../Components/TVSlider";
import TVDetail from "../Components/TVDetail";

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

function TV() {
	const history = useHistory();
	const bigTVMatch = useRouteMatch<{ tvId: string }>("/tvs/:tvId");

	const { data: dataAT, isLoading: isLoadingAT } = useQuery<IGetTVsResult>(
		["tvs", "airingToday"],
		getTVsAT
	);
	const { data: dataP, isLoading: isLoadingP } = useQuery<IGetTVsResult>(
		["tvs", "popular"],
		getTVsP
	);
	const { data: dataTR, isLoading: isLoadingTR } = useQuery<IGetTVsResult>(
		["tvs", "topRated"],
		getTVsTR
	);

	const location = useLocation<{ layoutId: string }>();

	const onOverlayClicked = () => {
		history.push("/tvs");
	};

	return (
		<Wrapper>
			{isLoadingAT || isLoadingP || isLoadingTR ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Banner
						$bgPhoto={makeImagePath(dataAT?.results[0].backdrop_path || "")}
					>
						<Title>{dataAT?.results[0].name}</Title>
						<OverView>{dataAT?.results[0].overview}</OverView>
					</Banner>

					<TVSlider title="방영 중" data={dataAT?.results.slice(1) || []} />
					<TVSlider title="현재 인기" data={dataP?.results || []} />
					<TVSlider title="최고 평점" data={dataTR?.results || []} />

					<AnimatePresence>
						{bigTVMatch && (
							<>
								<Overlay
									onClick={onOverlayClicked}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								<TVModal layoutId={location.state.layoutId}>
									<TVDetail tvId={+bigTVMatch.params.tvId} />
								</TVModal>
							</>
						)}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default TV;
