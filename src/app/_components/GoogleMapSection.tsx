"use client";
import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

export default function GoogleMapSection() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const containerStyle = {
		width: '100%',
		height: '80vh',
		borderRadius: 10,
	}

	const center = {
		lat: -3.745,
		lng: -38.523,
	}

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || '', // Usar variable de entorno
	})

	const [map, setMap] = React.useState(null)

	const onLoad = React.useCallback(function callback(map: any) {
		const bounds = new window.google.maps.LatLngBounds(center)
		map.fitBounds(bounds)
		setMap(map)
	}, [center])

	const onUnmount = React.useCallback(function callback(map: any) {
		setMap(null)
	}, [])

	if (!isClient) {
		return (
			<div className="w-full h-96 bg-gray-200 flex items-center justify-center">
				<div>Loading map...</div>
			</div>
		);
	}

	return (
		<div className="w-full h-96 mt-12 p-4 ">
			{isLoaded ? (
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={center}
					zoom={10}
					onLoad={onLoad}
					onUnmount={onUnmount}
					
				>
					{/* Child components, such as markers, info windows, etc. */}
					<></>
				</GoogleMap>
			) : (
				<div className="w-full h-full bg-gray-200 flex items-center justify-center">
					<div>Loading Google Maps...</div>
				</div>
			)}
		</div>
	)
}