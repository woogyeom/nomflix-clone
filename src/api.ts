import { useQuery } from "react-query";

const API_KEY = "a100771782560ea21d9963be1f246bf7";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IGetMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface IGetTVsResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: ITV[];
	total_pages: number;
	total_results: number;
}

export interface IGetSearchResult {
	page: number;
	results: ISearchResult[];
	total_pages: number;
	total_results: number;
}

export interface IMovie {
	backdrop_path: string | null;
	id: number;
	title: string;
	overview: string;
}

export interface ITV {
	backdrop_path: string | null;
	id: number;
	name: string;
	overview: string;
}

export interface ISearchResult {
	id: number;
	backdrop_path: string | null;
	overview: string;
	media_type: "movie" | "tv";

	title?: string;
	name?: string;
}

export interface IMovieDetail {
	id: number;
	backdrop_path: string;
	genres: {
		name: string;
	}[];
	overview: string;
	release_date: string;
	runtime: string;
	title: string;
}

export interface ITVDetail {
	id: number;
	backdrop_path: string;
	genres: {
		name: string;
	}[];
	overview: string;
	number_of_episodes: number;
	number_of_seasons: number;
	seasons: {
		episode_count: number;
		name: string;
		overview: string;
		season_number: number;
	}[];
	name: string;
}

export function getMoviesNP() {
	return fetch(
		`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}
export function getMoviesTR() {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}
export function getMoviesU() {
	return fetch(
		`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}

export function getMovieDetails(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}?api_key=${API_KEY}&language=ko-KR`
	).then((response) => response.json());
}

export function useMovieDetail(movieId: number) {
	return useQuery<IMovieDetail>(
		["movie", "detail", movieId],
		() => getMovieDetails(movieId),
		{
			staleTime: 1000 * 60 * 60,
			enabled: !!movieId,
		}
	);
}

export function getTVsAT() {
	return fetch(
		`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}
export function getTVsP() {
	return fetch(
		`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}
export function getTVsTR() {
	return fetch(
		`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}

export function getTVDetails(tvid: number) {
	return fetch(
		`${BASE_PATH}/tv/${tvid}?api_key=${API_KEY}&language=ko-KR`
	).then((response) => response.json());
}

export function useTVDetail(tvId: number) {
	return useQuery<ITVDetail>(["tv", "detail", tvId], () => getTVDetails(tvId), {
		staleTime: 1000 * 60 * 60,
		enabled: !!tvId,
	});
}

export function getSearchResults(keyword: string) {
	return fetch(
		`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=true&language=ko-KR&page=1&region=KR`
	).then((response) => response.json());
}
