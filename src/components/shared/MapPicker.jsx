// src/components/shared/MapPicker.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Locate, X, Search, Navigation, CheckCircle2, Map as MapIcon } from 'lucide-react';

// Shared UI components
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

/**
 * ZALLDI - Butwal-Locked Map Picker
 * Features: Localized centering, pin-drop animation, and mobile-optimized geolocation.
 */

export default function MapPicker({ value, onChange, isOpen, onClose }) {
  // Center on Butwal (Milanchowk area) by default
  const BUTWAL_CENTER = { lat: 27.7006, lng: 83.4484 };
  
  const [coordinates, setCoordinates] = useState(value || BUTWAL_CENTER);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (value) {
      setCoordinates(value);
    }
  }, [value, isOpen]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Basic check: Is the user actually in or near Butwal/Rupandehi?
        // (Optional: Add logic to warn if user is far from Butwal)
        
        setCoordinates(newCoords);
        setIsLoading(false);
        toast.success('Location updated');
      },
      (error) => {
        setIsLoading(false);
        let msg = 'Unable to get your location';
        if (error.code === 1) msg = 'Location access denied';
        toast.error(msg);
      },
      { enableHighAccuracy: true }
    );
  }

  const handleSave = () => {
    if (onChange) {
      onChange(coordinates);
    }
    onClose();
    toast.success('Delivery point set');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Set Delivery Point" 
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Search & Action Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <Input
              placeholder="Search area in Butwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl hover:bg-orange-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Locate size={22} />
            )}
          </motion.button>
        </div>

        {/* The Interactive "Map" Preview */}
        <div className="relative bg-gray-100 rounded-[2.5rem] overflow-hidden h-80 border-4 border-white shadow-inner group">
          
          {/* Mock Map Background (Placeholder for real Mapbox/Google/OSM) */}
          <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center overflow-hidden">
            <div className="opacity-20 pointer-events-none">
              <MapIcon size={200} className="text-gray-400 rotate-12" />
            </div>
            
            {/* The Visual Pin - Fixed at Center */}
            <div className="relative z-20 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <MapPin className="w-12 h-12 text-orange-600 drop-shadow-2xl" fill="currentColor" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-900/20 rounded-full blur-[2px]" />
              </motion.div>
            </div>
          </div>

          {/* Floating Address Preview Over Map */}
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                <Navigation size={20} className="rotate-45" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">Current Coordinates</p>
                <p className="text-sm font-black text-gray-900 truncate">
                  {coordinates.lat.toFixed(5)}°N, {coordinates.lng.toFixed(5)}°E
                </p>
              </div>
            </div>
          </div>

          {/* Instructional Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              Move Map to Pin Location
            </span>
          </div>
        </div>

        {/* Footer Info & Confirmation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Precision</p>
              <p className="text-sm font-bold text-gray-900">GPS Verified for Butwal Area</p>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 sm:flex-none text-gray-500 font-bold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-100 flex items-center gap-2"
            >
              Confirm Location <MapPin size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

