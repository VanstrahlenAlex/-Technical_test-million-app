"use client";
import { supabase } from "@/utils/supabase/client";
import Listing from "./Listing";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function ListingMapView({type} : { type: any}) {

	const [listing, setListing] = useState<any[]>([]);
	const [searchedAddress, setSearchedAddress] = useState<any | null>(null)

	const getLatestListing = async () => {
		const { data, error } = await supabase
			.from('listing')
			.select(`*, listingImages(url, listing_id)`)
			.eq('active', true)
			.eq('type', type)
			.order('id', {ascending: false})

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
		console.log(searchTerm);
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
	<div className="grid grid-cols-1 md:grid-cols-2">
		<div>
			<Listing 
				listing={listing}
				handleSearchClick={handleSearchClick}
				searchedAddress={(v : any) => setSearchedAddress(v)}
				/>
		</div>
		<div>
			map
		</div>
		
	</div>
  )
}
