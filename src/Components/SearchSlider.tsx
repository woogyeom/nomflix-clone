import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { ISearchResult, IMovie, ITV } from "../api";
import { makeImagePath } from "../utils";
import MovieGenre from "./MovieGenre";
import TVGenre from "./TVGenre";

const SliderContainer = styled.div`
	position: relative;
	height: 300px;
	top: 100px;
	margin: 0 10px;
`;

const SliderTitle = styled.h2`
	width: fit-content;
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 10px;
	padding-left: 10px;
	color: ${(props) => props.theme.white.lighter};
	cursor: pointer;
`;

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 10px;
	position: absolute;
	width: 100%;
`;

const rowVariants: Variants = {
	hidden: (width: number) => ({
		x: width - 25,
	}),
	visible: {
		x: 0,
	},
	exit: (width: number) => ({
		x: -width + 25,
	}),
};

const Box = styled(motion.div)<{ $bgPhoto: string; $boxIndex: number }>`
	background-color: white;
	background-image: linear-gradient(
			to bottom,
			rgba(19, 19, 19, 0) 0%,
			rgba(19, 19, 19, 0) 50%,
			rgba(19, 19, 19, 0.2) 60%,
			rgba(19, 19, 19, 0.4) 70%,
			rgba(19, 19, 19, 0.7) 85%,
			rgba(19, 19, 19, 1) 100%
		),
		url(${(props) => props.$bgPhoto});
	background-size: cover;
	background-position: center center;
	border-radius: 5px 5px 0 0;
	height: 200px;
	color: ${(props) => props.theme.white.darker};
	font-size: 24px;
	font-weight: 500;
	display: flex;
	justify-content: start;
	align-items: end;
	padding: 10px;
	cursor: pointer;
	transform-origin: ${(props) => {
		if (props.$boxIndex === 0) return "center left";
		if (props.$boxIndex === offset - 1) return "center right";
		return "center";
	}};
`;

const boxVariants: Variants = {
	normal: {
		scale: 1,
		transition: { type: "tween" },
	},
	hover: {
		scale: 1.3,
		y: -50,
		transition: { delay: 0.5, duration: 0.3, type: "tween" },
	},
};

const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	height: auto;
	left: 0px;
	top: 100%;
	justify-content: center;
	align-items: center;
	display: flex;
	text-align: center;
	font-size: 14px;
	z-index: 2;
	pointer-events: none;
`;

const infoVariants: Variants = {
	hover: {
		opacity: 1,
		pointerEvents: "auto",
		transition: { delay: 0.5, duration: 0.3, type: "tween" },
	},
};

const NoResultsText = styled.div`
	position: absolute;
	top: 80px;
	left: 10px;
	transform: translateY(-50%);
	font-size: 18px;
	color: ${(props) => props.theme.white.darker};
`;

interface ISliderProps {
	data: ISearchResult[];
	title: string;
}

const offset = 6;

function SearchSlider({ data, title }: ISliderProps) {
	const location = useLocation();
	const history = useHistory();
	const width = window.innerWidth;

	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);

	const totalItems = data.length;
	const maxIndex = Math.floor(totalItems / offset);

	const increaseIndex = () => {
		if (!data || totalItems <= offset) {
			return;
		}
		if (leaving) return;
		setLeaving(true);

		setIndex((prev) => {
			const nextIndex = prev + 1;
			if (nextIndex > maxIndex) {
				return 0;
			}
			return nextIndex;
		});
	};

	const keyword = new URLSearchParams(location.search).get("keyword");
	const onBoxClicked = (keyword: string, mediaType: string, itemId: number) => {
		history.push(`/search/${mediaType}s/${itemId}?keyword=${keyword}`, {
			layoutId: `${title}-${itemId}`,
		});
	};

	if (totalItems === 0) {
		return (
			<SliderContainer>
				<SliderTitle style={{ cursor: "default" }}>{title}</SliderTitle>
				<NoResultsText>검색 결과가 없습니다.</NoResultsText>
			</SliderContainer>
		);
	}

	const isSingleRow = totalItems <= offset;
	const limit = isSingleRow ? totalItems : offset;

	return (
		<SliderContainer>
			<SliderTitle
				onClick={increaseIndex}
				style={{ cursor: isSingleRow ? "default" : "pointer" }}
			>
				{title} {totalItems > offset && "→"}
			</SliderTitle>
			<AnimatePresence initial={false} onExitComplete={() => setLeaving(false)}>
				<Row
					variants={rowVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{ type: "tween", duration: 1 }}
					key={index}
					custom={width}
				>
					{/* 배열을 먼저 만들고 영화를 채움 */}
					{new Array(limit).fill(0).map((_, i) => {
						const startIndex = totalItems <= offset ? 0 : index * offset;
						const SearchResultIndex = startIndex + i;
						if (SearchResultIndex >= totalItems) return null;

						const item = data[SearchResultIndex];
						return (
							<Box
								layoutId={title + "-" + item.id}
								onClick={() =>
									onBoxClicked(keyword || "", item.media_type, item.id)
								}
								variants={boxVariants}
								initial="normal"
								whileHover="hover"
								key={`${title}-${item.id}-${index}`}
								$bgPhoto={makeImagePath(item.backdrop_path || "")}
								$boxIndex={i}
							>
								{item.media_type === "movie" ? item.title : item.name}
								<Info variants={infoVariants}>
									{item.media_type === "movie" ? (
										<MovieGenre movieId={item.id} />
									) : (
										<TVGenre tvId={item.id} />
									)}
								</Info>
							</Box>
						);
					})}
				</Row>
			</AnimatePresence>
		</SliderContainer>
	);
}

export default SearchSlider;
