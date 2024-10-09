// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);

  const addItemToMenu = (newItem) => {
    setMenuItems([...menuItems, newItem]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chef's Menu</Text>
      <Text style={styles.totalItems}>Total Menu Items: {menuItems.length}</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.course}</Text>
            <Text>Price: ${item.price}</Text>
          </View>
        )}
      />

      <Button
        title="Add Menu Item"
        onPress={() => navigation.navigate('AddMenuItem', { addItem: addItemToMenu })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalItems: {
    fontSize: 18,
    marginBottom: 20,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dishName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
