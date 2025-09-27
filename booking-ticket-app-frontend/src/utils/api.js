import { supabase } from './supabase';

// Fetch all active buses
export const getActiveBuses = async () => {
  try {
    console.log('Fetching all active buses...');
    const { data, error } = await supabase
      .from('Activebuses')
      .select('*');

    if (error) throw error;
    console.log('Active buses data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching active buses:', error.message);
    throw error;
  }
};

// Fetch all driver locations
export const getDriverLocations = async () => {
  try {
    console.log('Fetching all driver locations...');
    const { data, error } = await supabase
      .from('driver_locations')
      .select('*');

    if (error) throw error;
    console.log('Driver locations data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching driver locations:', error.message);
    throw error;
  }
};

// Get a specific active bus by ID
export const getActiveBusById = async (busId) => {
  try {
    console.log(`Fetching bus with ID: ${busId}...`);
    const { data, error } = await supabase
      .from('Activebuses')
      .select('*')
      .eq('id', busId)
      .single();

    if (error) throw error;
    console.log(`Bus ${busId} data:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching bus with ID ${busId}:`, error.message);
    throw error;
  }
};

// Get a specific driver's location by ID
export const getDriverLocationById = async (driverId) => {
  try {
    console.log(`Fetching location for driver ID: ${driverId}...`);
    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('driver_id', driverId)
      .single();

    if (error) throw error;
    console.log(`Driver ${driverId} location data:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching location for driver ${driverId}:`, error.message);
    throw error;
  }
};

// Add more API functions as needed for your application
