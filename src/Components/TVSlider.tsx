import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ITV } from "../api";
import { makeImagePath } from "../utils";
import TVGenre from "./TVGenre";

const SliderContainer = styled.div`
	position: relative;
	height: 300px;
	top: -100px;
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

const Box = styled(motion.div)<{ $bgPhoto: string }>`
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
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
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

interface ISliderProps {
	data: ITV[];
	title: string;
}

const offset = 6;

function TVSlider({ data, title }: ISliderProps) {
	const history = useHistory();
	const width = window.innerWidth;

	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);

	const increaseIndex = () => {
		if (data) {
			if (leaving) return;
			setLeaving(true);
			setIndex((prev) => prev + 1);
		}
	};

	const onBoxClicked = (tvId: number) => {
		history.push(`/tvs/${tvId}`, { layoutId: `${title}-${tvId}` });
	};

	return (
		<SliderContainer>
			<SliderTitle onClick={increaseIndex}>{title} &rarr;</SliderTitle>
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
					{new Array(offset).fill(0).map((_, i) => {
						if (data.length === 0) return null;
						const tvIndex = (index * offset + i) % data.length;
						const tv = data[tvIndex];
						return (
							<Box
								layoutId={title + "-" + tv.id}
								onClick={() => onBoxClicked(tv.id)}
								variants={boxVariants}
								initial="normal"
								whileHover="hover"
								key={`${title}-${tv.id}-${index}`}
								$bgPhoto={makeImagePath(tv.backdrop_path || "")}
							>
								{tv.name}
								<Info variants={infoVariants}>
									<TVGenre tvId={tv.id} />
								</Info>
							</Box>
						);
					})}
				</Row>
			</AnimatePresence>
		</SliderContainer>
	);
}

export default TVSlider;
