"use client";
import { supabase } from "@/utils/supabase/client";
import Listing from "./Listing";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GoogleMapSection from "./GoogleMapSection";


export default function ListingMapView({type} : { type: any}) {

	const [listing, setListing] = useState<any[]>([]);
	const [searchedAddress, setSearchedAddress] = useState<any | null>(null);
	const [bedCount, setBedCount] = useState(0);
	const [bathCount, setBathCount] = useState(0);
	const [parkingCount, setParkingCount] = useState(0);
	const [homeType, setHomeType] = useState();


	const getLatestListing = async () => {
		let query = await supabase
			.from('listing')
			.select(`*, listingImages(url, listing_id)`)
			.eq('active', true)
			.eq('type', type)
			.gte('bedromm', bedCount)
			.gte('bathroom', bathCount)
			.gte('parkingCount', parkingCount)
			.order('id', {ascending: false});

		if(homeType){
			query = query.eq('propertyType', homeType)
		}

		const { data, error } = await query;

		console.log("✅ TODOS los listings activos:", data); // Agregar este log
		console.log("🔍 Filtro aplicado - type:", type); // Agregar este log
		
		if (data) {
			setListing(data);
		}
		if(error){
			toast.error("Server Side Error")
		}
			
	}

	useEffect(() => {
		getLatestListing()
	}, [])

	const handleSearchClick = async () => {
		console.log("searchedAddress ada",searchedAddress);
		
		const searchTerm = searchedAddress?.value?.structured_formatting?.main_text;
		console.log("searchTerm", searchTerm);
		// 3:15:38
		const { data, error } = await supabase
			.from('listing')
			.select(`*, listingImages(url, listing_id)`)
			.eq('active', true)
			.eq('type', type)
			.like('address', '%'+searchTerm+'%')
			.order('id', { ascending: false })

		if(data){
			setListing(data)
		}
	}
	
  return (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div>
			<Listing 
				listing={listing}
				handleSearchClick={handleSearchClick}
				searchedAddress={(v : any) => setSearchedAddress(v)}
				setBedCount={setBedCount}
				setBathCount={setBathCount}
				setParkingCount={setParkingCount}
				setHomeType={setHomeType}
				/>
		</div>
		<div>
			<GoogleMapSection />
		</div>
		
	</div>
  )
}
