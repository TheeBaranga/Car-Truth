import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
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

    console.log("API_URL:", API_URL);
    console.log("Query:", query);

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>MOTII</Text>
        <Text style={styles.tagline}>
          Know What Moves You.
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.title}>Search a vehicle</Text>

        <Text style={styles.description}>
          Search a registration number or VIN to understand the vehicle behind it.
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
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileEyebrow}>MOTII VEHICLE PROFILE</Text>
              <Text style={styles.vehicleName}>
                {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.vehicleYear}>{vehicle.year}</Text>
              <Text style={styles.registrationNumber}>
                {vehicle.registration_number}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.identityHeader}>
              <Text style={styles.sectionLabel}>VEHICLE IDENTITY</Text>
              <Text style={styles.verifiedLabel}>FOUND</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.detailValue}>{vehicle.vin}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>VEHICLE INTELLIGENCE</Text>

            <View style={styles.historySection}>
              <Text style={styles.insightTitle}>History</Text>

              {vehicle.events?.length > 0 ? (
                vehicle.events.map((event: any, index: number) => (
                  <View key={`${event.event_date}-${event.title}-${index}`} style={styles.timelineEvent}>
                    <View style={styles.timelineMarkerColumn}>
                      <View style={styles.timelineMarker} />
                      {index < vehicle.events!.length - 1 && (
                        <View style={styles.timelineConnector} />
                      )}
                    </View>

                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineEventType}>
                        {event.event_type}
                      </Text>
                      <Text style={styles.historyEventTitle}>{event.title}</Text>
                      <Text style={styles.historyEventDate}>
                        {new Date(event.event_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                      <Text style={styles.insightSubtitle}>{event.description}</Text>
                      {event.source && (
                        <Text style={styles.historyEventSource}>
                          Source: {event.source}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.insightSubtitle}>
                  No history records available yet.
                </Text>
              )}
            </View>

            <View style={styles.insightRow}>
              <View>
                <Text style={styles.insightTitle}>Inspections</Text>
                <Text style={styles.insightSubtitle}>
                  Inspection records will appear here.
                </Text>
              </View>
              <Text style={styles.comingSoon}>SOON</Text>
            </View>

            <View style={styles.insightRow}>
              <View>
                <Text style={styles.insightTitle}>Market Value</Text>
                <Text style={styles.insightSubtitle}>
                  Understand what the vehicle is worth.
                </Text>
              </View>
              <Text style={styles.comingSoon}>SOON</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Verify. Understand. Buy with confidence.
        </Text>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

  profileCard: {
    marginTop: 24,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#1E293B',
  },

  profileHeader: {
    alignItems: 'center',
  },

  profileEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },

  vehicleName: {
    marginTop: 14,
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  vehicleYear: {
    marginTop: 4,
    fontSize: 16,
    color: '#94A3B8',
  },

  registrationNumber: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#CBD5E1',
  },

  divider: {
    height: 1,
    marginVertical: 22,
    backgroundColor: '#334155',
  },

  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#94A3B8',
  },

  verifiedLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#86EFAC',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  detailLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },

  detailValue: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    color: '#E2E8F0',
    textAlign: 'right',
  },

  historySection: {
    marginTop: 20,
  },

  timelineEvent: {
    flexDirection: 'row',
    marginTop: 20,
  },

  timelineMarkerColumn: {
    width: 20,
    alignItems: 'center',
  },

  timelineMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94A3B8',
    marginTop: 4,
  },

  timelineConnector: {
    width: 1,
    flex: 1,
    marginTop: 6,
    backgroundColor: '#475569',
  },

  timelineContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 4,
  },

  timelineEventType: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748B',
  },

  historyEventTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },

  historyEventDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
  },

  historyEventSource: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748B',
  },

  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },

  insightSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#94A3B8',
  },

  comingSoon: {
    marginLeft: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#64748B',
  },
});
