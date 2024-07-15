import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { Icon } from '@rneui/themed';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';

// Define the type for the character
interface Character {
  id: number;
  fullName: string;
  imageUrl: string;
}

// Define the type for the navigation prop
type RootStackParamList = {
  Home: { email: string };
  SearchResults: { searchResults: Character[] };
  Profile: { email: string; characters: Character[] };
};

type NavigationPropType = NavigationProp<RootStackParamList>;

const HomePage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<any>();

  const { email } = route.params;

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`https://thronesapi.com/api/v2/characters?page=${page}&pageSize=12`);
      if (response.data.length < 12) {
        setHasMore(false);
      }
      setCharacters(prev => [...prev, ...response.data]);
    } catch (err) {
      setError('Failed to load characters');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchError('Search input cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://thronesapi.com/api/v2/characters`);
      const allCharacters: Character[] = response.data;
      const filtered = allCharacters.filter(character => 
        character.fullName.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      if (filtered.length === 0) {
        setSearchError('No results found');
      } else {
        setSearchError(null);
        navigation.navigate('SearchResults', { searchResults: filtered });
      }
    } catch (err) {
      setSearchError('Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleProfileNavigation = () => {
    navigation.navigate('Profile', { email, characters });
  };

  const onSpeechStart = () => {
    setVoiceLoading(true);
  };

  const onSpeechEnd = () => {
    setVoiceLoading(false);
  };

  const onSpeechResults = (event: any) => {
    setSearchInput(event.value[0]);
  };

  const onSpeechError = (event: any) => {
    setVoiceLoading(false);
    Alert.alert('Error', `Voice recognition error: ${event.error.message}`);
  };

  const startVoiceRecognition = async () => {
    try {
      await Voice.start('en-US');
    } catch (e: any) {
      Alert.alert('Error', `Failed to start voice recognition: ${e.message}`);
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);
    if (text.trim() === '') {
      setSearchError(null);  // Clear search error if input is cleared
    }
  };

  if (loading && page === 1) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFD482" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  const renderCharacterItem = ({ item }: { item: Character }) => (
    <View style={styles.characterContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.fullName}</Text>
      <Text style={styles.characterId}>ID: {item.id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Icon
            name='user-circle-o'
            color="white"
            type='font-awesome'
            size={30}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Game of Thrones Characters</Text>
      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search Characters"
          placeholderTextColor="#C0C0C0"
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={!searchInput.trim()}>
          <Icon
            name='search'
            color="white"
            type='font-awesome'
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.micIconContainer} onPress={startVoiceRecognition}>
          <Icon
            name='microphone'
            color="white"
            type='font-awesome'
            size={20}
          />
        </TouchableOpacity>
      </View>
      {voiceLoading && (
        <ActivityIndicator size="large" color="#FFD482" />
      )}
      {searchError && (
        <View style={styles.centeredContainer}>
          <Text style={styles.text}>{searchError}</Text>
        </View>
      )}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={renderCharacterItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#FFD482" /> : null}
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 90,
  },
  iconContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D3D3D',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchBox: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
  },
  searchButton: {
    padding: 10,
  },
  micIconContainer: {
    padding: 10,
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
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomePage;
