"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';
import { reedemTicket } from '../ticket.api';

export default function QRTicketScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);

    // Start camera with better constraints
    const startCamera = async () => {
        try {
            stopCamera(); // Clean up any existing stream

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setHasPermission(true);
            setError(null);
            return true;
        } catch (err) {
            console.error('Camera error:', err);
            setHasPermission(false);
            setError(getCameraErrorMessage(err));
            return false;
        }
    };

    // Better camera error messages
    const getCameraErrorMessage = (error: any) => {
        if (error.name === 'NotAllowedError') {
            return 'Permiso de cámara denegado. Por favor habilita los permisos.';
        }
        if (error.name === 'NotFoundError') {
            return 'No se encontró cámara trasera.';
        }
        if (error.name === 'NotReadableError') {
            return 'La cámara ya está en uso o no se puede acceder.';
        }
        return 'No se pudo acceder a la cámara. Verifica los permisos.';
    };

    // Stop camera and clean up
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            streamRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Scan QR code with better validation
    const scanQRCode = () => {
        if (!videoRef.current || !canvasRef.current || !videoRef.current.videoWidth) {
            return null;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            // Using jsQR with options for better performance
            return jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert" // Better performance, default in future versions
            });
        } catch (err) {
            console.error('QR scan error:', err);
            return null;
        }
    };

    const scanLoop = () => {
        console.log("re")
        try {
            const code = scanQRCode();
            if (code && !isLoading) {
                handleQRDetected(code.data);
                return;
            }
        } catch (err) {
            console.error('Scan loop error:', err);
        }

        if (!isScanning) {
            animationRef.current = requestAnimationFrame(scanLoop);
        }
    };

    // Start scanning process
    const startScanning = async () => {
        setIsScanning(true);
        setResult(null);
        setError(null);
        console.log("imcio")
        try {
            const cameraStarted = await startCamera();

            if (!cameraStarted) {
                setIsScanning(false);
                return;
            }

            // Wait for video to be ready
            if (videoRef.current) {
                setIsScanning(true);
                const onLoadedMetadata = () => {
                    videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
                    console.log("ready")
                    scanLoop();
                };

                videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
            }
        } catch (err) {
            console.log("error")
            console.error('Start scanning error:', err);
            setError('Error al iniciar el escáner QR');
            setIsScanning(false);
            stopCamera();
        }
    };

    // Handle detected QR code
    const handleQRDetected = async (qrData: string) => {
        if (isLoading) return;

        setIsLoading(true);
        stopScanning();

        try {
            console.log("LA DATA",qrData);
            const ticketId = qrData.trim();
            if (!ticketId) throw new Error('QR inválido: no contiene ID de ticket');

            const ticket = await reedemTicket(ticketId);

            setResult({
                success: true,
                ticket,
                ticketId,
                message: 'Ticket canjeado exitosamente'
            });
            setError(null);
        } catch (err: any) {
            console.error('Ticket redemption error:', err);
            setError(err.message || 'Error al canjear el ticket');
            setResult({
                success: false,
                ticketId: qrData,
                message: err.message || 'Error desconocido'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Detener escaneo
    const stopScanning = () => {
        setIsScanning(false);
        stopCamera();
    };

    // Resetear y escanear de nuevo
    const resetAndScan = () => {
        setResult(null);
        setError(null);
        startScanning();
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Escáner de Tickets QR
            </h2>

            {/* Área de video/cámara */}
            <div className="relative mb-6">
                {isScanning ? (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-64 object-cover rounded-lg bg-gray-900"
                        />
                        <canvas
                            ref={canvasRef}
                            className="hidden"
                        />
                        {/* Overlay de escaneo */}
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                        {/* Indicador de escaneo */}
                        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            Escaneando...
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Estados de carga */}
            {isLoading && (
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                    <span className="text-blue-700">Procesando ticket...</span>
                </div>
            )}

            {/* Resultado exitoso */}
            {result && result.success && (
                <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-semibold text-green-800">¡Éxito!</span>
                    </div>
                    <p className="text-green-700 text-sm mb-2">{result.message}</p>
                    <p className="text-green-600 text-xs">
                        Ticket ID: {result.ticketId}
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="font-semibold text-red-800">Error</span>
                    </div>
                    <p className="text-red-700 text-sm">{error}</p>
                    {result && !result.success && (
                        <p className="text-red-600 text-xs mt-1">
                            Ticket ID: {result.ticketId}
                        </p>
                    )}
                </div>
            )}

            {/* Botones de control */}
            <div className="space-y-3">
                {!isScanning && !isLoading && (
                    <button
                        onClick={startScanning}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        <Camera className="w-5 h-5 mr-2" />
                        Iniciar Escaneo
                    </button>
                )}

                {isScanning && (
                    <button
                        onClick={stopScanning}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Detener Escaneo
                    </button>
                )}

                {(result || error) && !isLoading && (
                    <button
                        onClick={resetAndScan}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Escanear Otro
                    </button>
                )}
            </div>

            {/* Información de permisos */}
            {hasPermission === false && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-yellow-800 text-sm">
                            Se requiere acceso a la cámara para escanear códigos QR
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}