// src/components/customer/TrackingMap.jsx

 import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Map as MapIcon, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

/**
 * ZALLDI - Enterprise Delivery Tracking Map
 * Features: Visual delivery simulation, Butwal-optimized coordinates, and robust fallbacks.
 */

export default function TrackingMap({ destination, orderStatus }) {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Butwal center coordinates as fallback if destination is missing
  const BUTWAL_COORDS = { lat: 27.7006, lng: 83.4484 };
  const finalCoords = destination || BUTWAL_COORDS;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${finalCoords.lng - 0.005},${finalCoords.lat - 0.005},${finalCoords.lng + 0.005},${finalCoords.lat + 0.005}&layer=mapnik&marker=${finalCoords.lat},${finalCoords.lng}`;

  useEffect(() => {
    setMapError(false);
    setIsLoading(true);
  }, [destination]);

  const isOutForDelivery = orderStatus?.toLowerCase() === 'out_for_delivery';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Map Container */}
      <div className="relative w-full h-96 bg-gray-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
        
        {/* Animated Status Overlays */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
          <AnimatePresence>
            {isOutForDelivery && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-orange-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Truck className="text-orange-600" size={20} />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-orange-400 rounded-full -z-10"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">Live Tracking</p>
                    <p className="text-sm font-black text-gray-900 leading-none">Driver is approaching</p>
                  </div>
                </div>
                <Badge pulse>ON THE WAY</Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-0 bg-gray-50 flex flex-col items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="text-orange-200" size={40} />
            </motion.div>
            <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-tighter">Locating Delivery Point...</p>
          </div>
        )}

        {/* Map Iframe */}
        {!mapError ? (
          <iframe
            title="Delivery Location"
            src={mapUrl}
            className={`w-full h-full border-0 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => setMapError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
            <MapIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h4 className="font-bold text-gray-900">Map View Unavailable</h4>
            <p className="text-sm text-gray-500 mb-6 max-w-[240px]">We're having trouble loading the visual map, but your delivery is still on track.</p>
            <Button 
              onClick={() => window.open(`https://www.google.com/maps?q=${finalCoords.lat},${finalCoords.lng}`, '_blank')}
              className="bg-gray-900 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2"
            >
              Open Google Maps <ExternalLink size={14} />
            </Button>
          </div>
        )}

        {/* Floating Safe-Badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
           <ShieldCheck className="text-green-400" size={16} />
           <span className="text-[10px] font-bold text-white uppercase tracking-wider">Contactless Delivery Enabled</span>
        </div>
      </div>

      {/* Location Meta Footer */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
            <MapPin size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Precise Destination</p>
            <p className="font-black text-gray-900">
              {finalCoords.lat.toFixed(4)}° N, {finalCoords.lng.toFixed(4)}° E
            </p>
            <p className="text-xs text-orange-600 font-bold mt-1 flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> Butwal, Rupandehi
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <a
            href={`https://www.google.com/maps?q=${finalCoords.lat},${finalCoords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 group"
          >
            <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            GET DIRECTIONS
          </a>
        </div>
      </div>
    </motion.div>
  );
}

const Badge = ({ children, pulse }) => (
  <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black tracking-tighter">
    {pulse && <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />}
    {children}
  </span>
);

