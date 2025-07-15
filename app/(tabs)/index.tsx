import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useInfiniteScroll from "@/services/useInfiniteScroll";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const {
    data: movies,
    loading,
    loadingMore,
    error,
    loadMore,
  } = useInfiniteScroll((page) => fetchMovies({ query: "", page }));
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full" />
      <View className="flex-1 px-5">
        <Image source={icons.logo} className="w-12 ht-10 mt-20 mb-5 mx-auto" />
        <SearchBar
          placeholder="Search for a movie"
          onPress={() => router.push("/search")}
        />
        <Text className="text-lg text-white font-bold mt-5 mb-3">
          Latest Movies
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
        ) : error ? (
          <Text className="text-white text-center mt-10">
            Error: {error.message}
          </Text>
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#0000ff"
                  className="py-4"
                />
              ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}
