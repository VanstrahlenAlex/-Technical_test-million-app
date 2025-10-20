"use client";
import { MapPin } from 'lucide-react';
import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { toast } from 'sonner';

export default function GoogleAddressSearch({
	selectedAddress,
	setCoordinates
}: {
	selectedAddress: (address: string) => void,
	setCoordinates: (coords: { lat: number, lng: number }) => void
}) {
	return (
		<div className='flex items-center w-full'>
			<MapPin className='h-10 w-10 p-2 rounded-l-lg text-gray-500 bg-slate-200 ' />
			<GooglePlacesAutocomplete
				apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ''}
				selectProps={{
					placeholder: 'Search Property Address',
					isClearable: true,
					className: 'w-full',
					onChange: (place: any) => {
						console.log(place);

						if (!place) {
							selectedAddress('');
							setCoordinates({ lat: 0, lng: 0 });
							return;
						}

						// Extraer solo el label (texto de la dirección)
						const addressLabel = place.label;
						console.log("[address label in GoogleAddressSearch]", addressLabel);

						// Pasar solo el string de la dirección al componente padre
						selectedAddress(addressLabel);

						// Obtener coordenadas
						geocodeByAddress(addressLabel)
							.then(result => getLatLng(result[0]))
							.then(({ lat, lng }) => {
								console.log('Coordinates:', { lat, lng });
								setCoordinates({ lat, lng });
							})
							.catch(error => {
								console.error('Geocoding error:', error);
								toast.error('Error al obtener coordenadas');
							});
					}
				}}
			/>
		</div>
	)
}

// "use client";
// import { MapPin } from 'lucide-react';
// import React from 'react'
// import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
// import { toast } from 'sonner';

// export default function GoogleAddressSearch({ selectedAddress, setCoordinates }: { selectedAddress: (address: any) => void, setCoordinates: (coords: { lat: number, lng: number }) => void }) {
// 	return (
// 		<div className='flex items-center w-full'>
// 			<MapPin className='h-10 w-10 p-2 rounded-l-lg text-gray-500 bg-slate-200 ' />
// 			<GooglePlacesAutocomplete
				
// 			apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ''}
// 			selectProps={{
// 				placeholder: 'Search Property Address',
// 				isClearable: true,
// 				className: 'w-full',
// 				onChange:(place :any ) => {
// 					console.log(place);
// 					// Safely handle null or string/place objects returned by the component
// 					// const address = typeof place === 'string' ? place : place?.label ?? '';
// 					selectedAddress(place);
// 					if (!place) {
// 						setCoordinates({ lat: 0, lng: 0 });
// 						return;
// 					}
// 					// geocodeByAddress(place).then(result => getLatLng(result[0])).then(({ lat, lng }) => {
// 					// 	// console.log('Successfully got latitude and longitude:', { lat, lng });
// 					// 	setCoordinates({ lat, lng });
// 					// });
// 					const address = typeof place === 'string' ? place : place?.label ?? '';
// 					console.log("[address in GoogleAddressSearch]",address);
					
// 					geocodeByAddress(address)
// 						.then(result => getLatLng(result[0]))
// 						.then(({ lat, lng }) => {
// 							console.log('Coordinates:', { lat, lng });
// 							setCoordinates({ lat, lng });
// 						})
// 						.catch(error => {
// 							console.error('Geocoding error:', error);
// 							toast.error('Geocoding error:', error)
// 						});
// 				}
// 			}}
// 			/>
// 		</div>
// 	)
// }
