import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ListRenderItem } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Define types for search results item
interface CharacterItem {
  id: number;
  fullName: string;
  imageUrl: string;
}

// Define types for route params
type SearchResultsScreenRouteProp = RouteProp<{ SearchResults: { searchResults: CharacterItem[] } }, 'SearchResults'>;

interface SearchResultsScreenProps {
  route: SearchResultsScreenRouteProp;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ route }) => {
  const { searchResults } = route.params;

  const renderCharacterItem: ListRenderItem<CharacterItem> = ({ item }) => (
    <View style={styles.characterContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.fullName}</Text>
      <Text style={styles.characterId}>ID: {item.id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Results</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={renderCharacterItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  characterContainer: {
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  characterImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  characterName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  characterId: {
    color: '#C0C0C0',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;
