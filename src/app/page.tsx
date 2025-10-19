import { Button } from "@/components/ui/button";
import ListingMapView from "./_components/ListingMapView";


export default function Home() {
	return (
		
		<div className="px-10 p-10 mt-10">
			<ListingMapView type="Sell" />
		</div>
	);
}
