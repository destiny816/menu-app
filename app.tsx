import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';

interface UnsplashResponse {
  results: {
    urls: {
      small: string;
    };
  }[];
}

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash API Key

const fetchImageForDish = async (dishName: string) => {
  try {
    const response = await axios.get<UnsplashResponse>(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query: dishName,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.small; // Returns the first image's small URL
    } else {
      return 'https://via.placeholder.com/150'; // Fallback if no image is found
    }
  } catch (error) {
    console.log('Error fetching image:', error);
    return 'https://via.placeholder.com/150'; // Fallback if error occurs
  }
};

const HomeScreen: React.FC = () => {
  const [name, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Appetizer'); // Default category
  const [price, setPrice] = useState<string>('');
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const categories = ['Appetizer', 'Main Course', 'Dessert'];

  const addMenuItem = async () => {
    if (name && description && category && price && !isNaN(parseFloat(price))) {
      const imageUrl = await fetchImageForDish(name); // Fetch image dynamically based on the dish name
      const newItem = {
        name,
        description,
        category,
        price: parseFloat(price),
        imageUri: imageUrl,
      };
      setMenuItems([...menuItems, newItem]); // Update the menu items
      setDishName('');
      setDescription('');
      setCategory('Appetizer'); // Reset category to default
      setPrice('');
    } else {
      Alert.alert('Error', 'Please fill in all fields with valid data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Menu Item</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setDishName}
          placeholder="Dish Name"
        />
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
        />
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
        />
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategoryButton,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuItemsContainer}>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.category}</Text>
              <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background
  },
  header: {
    backgroundColor: '#007bff', // Bootstrap primary blue
    padding: 20,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedCategoryButton: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    color: '#007bff',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemsContainer: {
    padding: 20,
  },
  menuItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default HomeScreen;

