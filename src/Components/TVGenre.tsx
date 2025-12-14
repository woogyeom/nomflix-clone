import { useTVDetail } from "../api";

interface IGenreProps {
	tvId: number;
}

function TVGenre({ tvId }: IGenreProps) {
	const { data, isLoading } = useTVDetail(tvId);

	if (isLoading) return <span>Loading...</span>;

	return (
		<div>
			{data?.genres && data.genres.length > 0
				? data.genres.map((g) => g.name).join(" • ")
				: "장르 없음"}
		</div>
	);
}

export default TVGenre;
