"use client";
import { MapPin } from 'lucide-react';
import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

export default function GoogleAddressSearch({ selectedAddress, setCoordinates }: { selectedAddress: (address: string) => void, setCoordinates: (coords: { lat: number, lng: number }) => void }) {
	return (
		<div className='flex items-center w-full'>
			<MapPin className='h-10 w-10 p-2 rounded-l-lg text-gray-500 bg-slate-200 ' />
			<GooglePlacesAutocomplete
				
			apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ''}
			selectProps={{
				placeholder: 'Search Property Address',
				isClearable: true,
				className: 'w-full',
				onChange:(place) => {
					console.log(place);
					// Safely handle null or string/place objects returned by the component
					const address = typeof place === 'string' ? place : place?.label ?? '';
					selectedAddress(address);
					if (!address) return;
					geocodeByAddress(address).then(result => getLatLng(result[0])).then(({ lat, lng }) => {
						// console.log('Successfully got latitude and longitude:', { lat, lng });
						setCoordinates({ lat, lng });
					});
				}
			}}
			/>
		</div>
	)
}
