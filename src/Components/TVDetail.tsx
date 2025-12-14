import { styled } from "styled-components";
import { useMovieDetail, useTVDetail } from "../api";
import { makeImagePath } from "./../utils";

interface IDetailProps {
	tvId: number;
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

function TVDetail({ tvId }: IDetailProps) {
	const { data, isLoading } = useTVDetail(tvId);

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
					<Title>{data?.name}</Title>
					<Details>
						<span>장르: {data?.genres.map((g) => g.name).join(" • ")}</span>
						<span>시즌 수: {data?.number_of_seasons}</span>
						<span>에피소드 수: {data?.number_of_episodes}</span>
					</Details>
				</Header>
			</Image>
			<Overview>{data?.overview}</Overview>
		</>
	);
}

export default TVDetail;
