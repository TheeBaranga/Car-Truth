import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const query = searchQuery.trim().toUpperCase();

    if (!query || !API_URL) {
      return;
    }

    setIsLoading(true);
    setVehicle(null);
    setError('');

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/vehicles/search/?query=${query}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Vehicle not found.');
        }

        throw new Error('Something went wrong. Please try again.');
      }

      const vehicleData = await response.json();

      setVehicle(vehicleData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to search for vehicle.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>CAR TRUTH</Text>
        <Text style={styles.tagline}>
          Know the history before you buy.
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.title}>Search a vehicle</Text>

        <Text style={styles.description}>
          Enter a Kenyan registration number or VIN to view the vehicle's
          history.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. KDA 123A or VIN"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text.toUpperCase())}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={17}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Text style={styles.buttonText}>Search Vehicle</Text>
        </TouchableOpacity>

        {isLoading && (
          <Text style={styles.statusText}>Searching...</Text>
        )}

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {vehicle && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Vehicle Found</Text>

            <Text style={styles.resultText}>
              Registration: {vehicle.registration_number}
            </Text>

            <Text style={styles.resultText}>
              VIN: {vehicle.vin}
            </Text>

            <Text style={styles.resultText}>
              Make: {vehicle.make}
            </Text>

            <Text style={styles.resultText}>
              Model: {vehicle.model}
            </Text>

            <Text style={styles.resultText}>
              Year: {vehicle.year}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Verify. Understand. Buy with confidence.
        </Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },

  header: {
    marginTop: 80,
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: '#94A3B8',
  },

  searchSection: {
    marginTop: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5E1',
  },

  input: {
    height: 56,
    marginTop: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#0F172A',
  },

  button: {
    height: 56,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },

  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  statusText: {
  marginTop: 20,
  textAlign: 'center',
  color: '#CBD5E1',
  fontSize: 16,
},

errorText: {
  marginTop: 20,
  textAlign: 'center',
  color: '#F87171',
  fontSize: 16,
},

resultCard: {
  marginTop: 24,
  padding: 20,
  borderRadius: 16,
  backgroundColor: '#1E293B',
},

resultTitle: {
  marginBottom: 16,
  fontSize: 20,
  fontWeight: '700',
  color: '#FFFFFF',
},

resultText: {
  marginTop: 8,
  fontSize: 15,
  color: '#CBD5E1',
},
});
