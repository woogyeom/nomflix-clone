import { useMovieDetail } from "../api";

interface IGenreProps {
	movieId: number;
}

function MovieGenre({ movieId }: IGenreProps) {
	const { data, isLoading } = useMovieDetail(movieId);

	if (isLoading) return <span>Loading...</span>;

	return (
		<div>
			{data?.genres && data.genres.length > 0
				? data.genres.map((g) => g.name).join(" • ")
				: "장르 없음"}
		</div>
	);
}

export default MovieGenre;
