"use client";
import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';


export default function AddNewListing() {

	const [selectedAddress, setSelectedAddress] = useState<string>('');
	const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
	const {user} = useUser();
	const [loader, setLoader] = useState(false);
	const router = useRouter();

	const nextHandler = async() => {
		console.log(selectedAddress, coordinates);
		setLoader(true);

		// =====SUPABASE=====
		const { data, error } = await supabase
			.from('listing')
			.insert([
				{ 
					address: selectedAddress, 
					coordinates: coordinates,
					createdBy: user?.primaryEmailAddress?.emailAddress,
					created_at: new Date(),
				},
			])
			.select();

			if(data){
				setLoader(false);
				toast.success('Listing added successfully!');
				router.replace('/edit-listing/'+data[0].id)
			}
			if(error){
				setLoader(false);
				toast.error('Error adding listing. Please try again.');
			}
			// 2:03:30
		// =====SUPABASE FIN=====
	}
	return (
		<div className='mt-10 md:mx-56 lg:mx-80'>
			<div className='flex flex-col gap-5 items-center justify-center h-screen'>
				<h2 className='font-bold text-2'>Add New Listing</h2>
				<div className='p-10 px-28 w-full rounded-lg border shadow-md flex flex-col gap-5'>
					<h2 className='text-gray-500'>Enter Address which you want to list</h2>
					<GoogleAddressSearch 
						selectedAddress={(address) => setSelectedAddress(address)}
						setCoordinates={(coords) => setCoordinates(coords)}
					/>
					<Button
						disabled={!selectedAddress || !coordinates}
						onClick={nextHandler}
					>
						{loader ? 
						<Spinner  color="white" />
						: 'Next'}
					</Button>
				</div>
				<div className='w-full flex justify-end'>
					
				</div>
			</div>
		</div>
	)

}
