"use client"
import { useState, useEffect, useRef } from 'react';

interface LocationPickerProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
}

declare global {
    interface Window {
        L: any;
    }
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    // Inicializar mapa
    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
            // Cargar Leaflet dinámicamente
            const loadLeaflet = async () => {
                try {
                    // Cargar CSS de Leaflet
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);

                    // Cargar JS de Leaflet
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => {
                        initializeMap();
                    };
                    document.head.appendChild(script);
                } catch (error) {
                    console.error('Error loading Leaflet:', error);
                }
            };

            const initializeMap = () => {
                if (!window.L || !mapRef.current) return;

                // Coordenadas por defecto (Colombia)
                const defaultLat = latitude || 4.7110;
                const defaultLng = longitude || -74.0721;

                // Crear mapa
                const map = window.L.map(mapRef.current).setView([defaultLat, defaultLng], 10);

                // Agregar tiles de OpenStreetMap
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Crear marcador
                const marker = window.L.marker([defaultLat, defaultLng], {
                    draggable: true
                }).addTo(map);

                // Evento cuando se arrastra el marcador
                marker.on('dragend', function (e: any) {
                    const position = e.target.getLatLng();
                    onLocationChange(position.lat, position.lng);
                });

                // Evento al hacer clic en el mapa
                map.on('click', function (e: any) {
                    const { lat, lng } = e.latlng;
                    marker.setLatLng([lat, lng]);
                    onLocationChange(lat, lng);
                });

                mapInstanceRef.current = map;
                markerRef.current = marker;
                setMapLoaded(true);
            };

            loadLeaflet();
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    // Actualizar posición del marcador cuando cambian las coordenadas
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
            const newLatLng = [latitude, longitude];
            markerRef.current.setLatLng(newLatLng);
            mapInstanceRef.current.setView(newLatLng, mapInstanceRef.current.getZoom());
        }
    }, [latitude, longitude]);

    // Función para obtener ubicación actual
    const getCurrentLocation = () => {
        setUseCurrentLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('La geolocalización no está soportada por este navegador.');
            setUseCurrentLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                onLocationChange(lat, lng);

                // Centrar mapa en la nueva ubicación
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([lat, lng], 15);
                }

                setUseCurrentLocation(false);
            },
            (error) => {
                let errorMessage = 'Error al obtener la ubicación.';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Información de ubicación no disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado para obtener la ubicación.';
                        break;
                }

                setLocationError(errorMessage);
                setUseCurrentLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleManualInput = (field: 'latitude' | 'longitude', value: string) => {
        const numValue = parseFloat(value) || 0;
        if (field === 'latitude') {
            onLocationChange(numValue, longitude);
        } else {
            onLocationChange(latitude, numValue);
        }
    };

    return (
        <div className="space-y-6">
            {/* Mapa interactivo */}
            <div className="relative">
                <div
                    ref={mapRef}
                    className="w-full h-96 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden"
                    style={{ minHeight: '384px' }}
                >
                    {!mapLoaded && (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <svg className="animate-spin w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p>Cargando mapa...</p>
                            </div>
                        </div>
                    )}
                </div>

                {mapLoaded && (
                    <div className="absolute top-3 right-3 bg-white p-2 rounded-lg shadow-md text-xs">
                        <div className="font-medium text-gray-700">Coordenadas:</div>
                        <div className="text-gray-600">
                            {latitude ? latitude.toFixed(6) : '0'}, {longitude ? longitude.toFixed(6) : '0'}
                        </div>
                    </div>
                )}
            </div>

            {/* Instrucciones */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-green-700">
                        <strong>Cómo usar:</strong> Arrastra el marcador rojo o haz clic en cualquier parte del mapa para seleccionar una ubicación.
                    </div>
                </div>
            </div>

            {/* Controles de ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Latitud */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitud
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={latitude || ''}
                        onChange={(e) => handleManualInput('latitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: 4.7110"
                    />
                </div>

                {/* Longitud */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitud
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={longitude || ''}
                        onChange={(e) => handleManualInput('longitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: -74.0721"
                    />
                </div>
            </div>

            {/* Botones de control */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={useCurrentLocation}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {useCurrentLocation ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Obteniendo ubicación...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Usar mi ubicación actual
                        </>
                    )}
                </button>

                {(latitude || longitude) && (
                    <button
                        type="button"
                        onClick={() => onLocationChange(0, 0)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300"
                    >
                        Limpiar ubicación
                    </button>
                )}
            </div>

            {/* Error de ubicación */}
            {locationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-red-700">{locationError}</div>
                    </div>
                </div>
            )}

            {/* Información de ayuda */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-700">
                        <strong>Ayuda:</strong> Puedes ingresar las coordenadas manualmente, usar tu ubicación actual, o interactuar directamente con el mapa arrastrando el marcador o haciendo clic donde desees.
                    </div>
                </div>
            </div>
        </div>
    );
}