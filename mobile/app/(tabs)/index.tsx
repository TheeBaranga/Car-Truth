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
    const query = searchQuery.replace(/\s+/g, '').toUpperCase();

    if (!query || !API_URL) {
      return;
    }

    setIsLoading(true);
    setVehicle(null);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles/search/?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No vehicle found with those details.');
        }

        throw new Error('Unable to complete the search. Please try again.');
      }

      const vehicleData = await response.json();
      setVehicle(vehicleData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
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
          style={[
            styles.button,
            (!searchQuery.trim() || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isLoading}
          accessibilityRole="button"
          accessibilityLabel="Search for vehicle"
          accessibilityState={{ disabled: !searchQuery.trim() || isLoading }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Searching...' : 'Search Vehicle'}
          </Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.statusText}>Searching vehicle history...</Text>
          </View>
        )}

        {!isLoading && error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Vehicle not found</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && vehicle && (
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

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  errorCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#3F1D2E',
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FCA5A5',
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
    fontSize: 15,
    color: '#CBD5E1',
  },

  errorText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#FECACA',
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
