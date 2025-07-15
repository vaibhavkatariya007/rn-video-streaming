export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_TOKEN,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_TOKEN}`,
  },
};

export const fetchMovies = async ({
  query,
  page = 1,
  noPagination = false,
}: {
  query: string;
  page?: number;
  noPagination: boolean;
}): Promise<
  | Movie[]
  | {
      results: Movie[];
      total_pages: number;
      page: number;
      noPagination: boolean;
    }
> => {
  const endPoint = query
    ? `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    : `/discover/movie?sort_by=popularity.desc&page=${page}`;
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}${endPoint}`, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });
  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch movies ", response.statusText);
  }
  const data = await response.json();
  if (noPagination) {
    return data?.results;
  } else {
    return {
      results: data.results,
      total_pages: data.total_pages,
      page: data.page,
    };
  }
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
