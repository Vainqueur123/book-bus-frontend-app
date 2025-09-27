import { supabase } from './supabase';

// Fetch all active buses
export const getActiveBuses = async () => {
  try {
    console.log('🔍 [API] Fetching all active buses from Supabase...');
    
    // Log Supabase client initialization
    console.log('[API] Supabase client initialized:', !!supabase);
    
    // Make the API call
    const { data, error, status } = await supabase
      .from('Activebuses')
      .select('*');

    console.log(`[API] Supabase response - Status: ${status}`);
    
    if (error) {
      console.error('❌ [API] Error fetching active buses:', error);
      throw error;
    }
    
    console.log(`✅ [API] Successfully fetched ${data?.length || 0} active buses`);
    console.log('[API] Sample bus data:', data?.[0] || 'No data');
    
    return data || [];
  } catch (error) {
    console.error('❌ [API] Unhandled error in getActiveBuses:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
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
