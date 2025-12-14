import { styled } from "styled-components";
import { useMovieDetail } from "../api";
import { makeImagePath } from "./../utils";
import { useEffect } from "react";

interface IDetailProps {
	movieId: number;
}

const Image = styled.div`
	width: 100%;
	height: 60%;
	background-size: cover;
	background-position: center center;
	display: flex;
	justify-content: start;
	align-items: end;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	width: 100%;
	padding: 10px;
`;

const Title = styled.h1`
	font-size: 48px;
	font-weight: 600;
	flex: 1;
`;

const Overview = styled.p`
	font-size: 18px;
	font-weight: 400;
	line-height: 1.5;
	padding: 10px;
	flex: 1;
	overflow-y: auto;
`;

const Details = styled.div`
	display: flex;
	flex-direction: column;
	width: auto;
	flex-shrink: 0;
	white-space: nowrap;

	span {
		align-self: flex-end;
		font-size: 14px;
		margin-bottom: 3px;
		font-weight: 400;
	}
`;

function MovieDetail({ movieId }: IDetailProps) {
	const { data, isLoading } = useMovieDetail(movieId);

	if (isLoading) return <span>Loading...</span>;

	return (
		<>
			<Image
				style={{
					backgroundImage: `
                    linear-gradient(to bottom, 
                    rgba(19, 19, 19, 0) 0%, 
                    rgba(19, 19, 19, 0) 70%, 
                    rgba(19, 19, 19, 1) 100%
                    ),
                    url(${makeImagePath(data?.backdrop_path || "", "w1280")})`,
				}}
			>
				<Header>
					<Title>{data?.title}</Title>
					<Details>
						<span>장르: {data?.genres.map((g) => g.name).join(" • ")}</span>
						<span>개봉일: {data?.release_date}</span>
						<span>상영시간: {data?.runtime}분</span>
					</Details>
				</Header>
			</Image>
			<Overview>{data?.overview}</Overview>
		</>
	);
}

export default MovieDetail;
