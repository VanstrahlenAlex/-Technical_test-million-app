"use client";
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import FileUpload from '../_components/FileUpload';
import { Spinner } from '@/components/ui/spinner';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditListing(
	// {params}: { params: { id: string } }
) {
	const [date, setDate] = React.useState<Date>();
	const today = new Date()
	const futureDate = new Date()
	futureDate.setFullYear(today.getFullYear() + 10)

	const params = useParams();
	// console.log("params antes del ",params)

	const { user } = useUser();
	const router = useRouter()
	const [listing, setListing] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);


	useEffect(() => {
		// console.log("params",params.id);
		user && verifyUserRecord()

	}, [user]);

	const verifyUserRecord = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;
		// if we don't have an email, don't call supabase
		if (!email) return;

		const { data, error } = await supabase
			.from('listing')
			.select('*, listingImages(listing_id, url)')
			.eq('createdBy', email)
			.eq('id', params.id)
		console.log(data);

		if (data) {
			setListing(data[0])
		}
		if (Array.isArray(data) && data.length <= 0) {
			router.replace('/')
		}
	}

	const onSubmitHandler = async (formValue: any) => {
		setLoading(true);
		const { data, error } = await supabase
			.from('listing')
			.update(formValue)
			.eq('id', params.id)
			.select()
		console.log(data);
		if (data) {
			toast.success("The property was updated successfully");
			setLoading(false);
			router.push('/')
		}
		for (const image of images) {
			setLoading(true);
			const file = image;
			const fileName = Date.now().toString();
			const fileExt = fileName.split('').pop();
			const { data, error } = await supabase.storage
				.from('listingImages')
				.upload(`${fileName}`, file, {
					contentType: `image/${fileExt}`,
					upsert: false
				});
			if (error) {
				setLoading(false)
				toast.error('Error while uploading images')
				// toast.error(error)
			}
			else {

				const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
				const { data, error } = await supabase
					.from('listingImages')
					.insert([
						{ url: imageUrl, listing_id: params.id }
					])
					.select();
				if (data) { setLoading(false); }
				if (error) { setLoading(false) }
			}
			setLoading(false);
		}
	}
	const publishBtnhandler = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('listing')
			.update({ active: 'true' })
			.eq('id', params?.id)
			.select()

			if(data){
				setLoading(false)
				toast.success("Listing Published and Saved!")
			}
	}

	return (
		<div className='pt-30'>
			<div className='px-10 md:px-36 my-10 items-center justify-center h-screen'>
				<h2 className='font-bold text-2xl'>Enter some more details about your listing</h2>
				<Formik
					enableReinitialize={true}
					initialValues={{
						type: listing?.type || '',
						propertyType: listing?.propertyType || '',
						bedroom: listing?.bedroom || '',
						bathroom: listing?.bathroom || '',
						builthIn: listing?.builthIn || '',
						dateSale: listing?.dateSale || '',
						parking: listing?.parking || '',
						lotSize: listing?.lotSize || '',
						area: listing?.area || '',
						price: listing?.price || '',
						hoa: listing?.hoa || '',
						description: listing?.description || '',
						profileImage: user?.imageUrl,
						fullName: user?.fullName
					}}
					onSubmit={(values) => {
						console.log(values);
						onSubmitHandler(values)
					}}
				>
					{({
						values,
						handleChange,
						handleSubmit,
						setFieldValue
					}) => (
						<form onSubmit={handleSubmit}>
							<div className='p-8 rounded-lg shadow-md'>
								<div className='grid grid-cols-1 md:grid-cols-3'>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Rent or Sell?</h2>
										<RadioGroup
											value={values.type}
											onValueChange={(v) => setFieldValue('type', v)}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="Rent" id="Rent" />
												<Label htmlFor="Rent">Rent</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="Sell" id="Sell" />
												<Label htmlFor="Sell">Sell</Label>
											</div>
										</RadioGroup>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Property Type</h2>
										<Select
											onValueChange={(e) => setFieldValue('propertyType', e)}
											name='propertyType'
											value={values.propertyType}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select Property Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='none' disabled >--Select type--</SelectItem>
												<SelectItem value="Single_Family_House">Single Family House</SelectItem>
												<SelectItem value="Town_House">Town House</SelectItem>
												<SelectItem value="Condo">Condo</SelectItem>
											</SelectContent>
										</Select>
									</div>

								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-4'>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Bedrooms</h2>
										<Input
											type="number"
											placeholder='e.g. 3'
											name='bedroom'
											onChange={handleChange}
											defaultValue={listing?.bedroom}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Bathrooms</h2>
										<Input
											type="number"
											placeholder='e.g. 2'
											name='bathroom'
											onChange={handleChange}
											defaultValue={listing?.bathroom}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Year</h2>
										<Input
											type="number"
											placeholder='e.g. 2020'
											name='builthIn'
											onChange={handleChange}
											defaultValue={listing?.builthIn}

										/>
									</div>

								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-4'>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Date Sale</h2>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													data-empty={!date}
													className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
													name='dateSale'
													onChange={handleChange}
													defaultValue={listing?.dateSale}
												>
													<CalendarIcon />
													{date ? format(date, "PPP") : <span>Pick a date</span>}
													{/* {values.dateSale ? format(new Date(values.dateSale), "PPP") : <span>Pick a date</span>} */}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={date}
													onSelect={setDate}
													captionLayout="dropdown"

												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Parking</h2>
										<Input
											type="number"
											placeholder='e.g. 2'
											name='parking'
											onChange={handleChange}
											defaultValue={listing?.parking}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Lot Size</h2>
										<Input
											type="number"
											placeholder='e.g. 2'
											name='lotSize'
											onChange={handleChange}
											defaultValue={listing?.lotSize}
										/>
									</div>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-4'>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Area (Sq.Ft)</h2>
										<Input
											type="number"
											placeholder='e.g. 1900'
											name='area'
											onChange={handleChange}
											defaultValue={listing?.area}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>Selling Price($)</h2>
										<Input
											type="number"
											placeholder='50000'
											name='price'
											onChange={handleChange}
											defaultValue={listing?.price}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<h2 className='text-lg text-slate-500'>HOA (Per Month)($)</h2>
										<Input
											type="number"
											placeholder='2000'
											name='hoa'
											onChange={handleChange}
											defaultValue={listing?.hoa}
										/>
									</div>
								</div>
								<div className='flex flex-col gap-2 pt-4'>
									<h2 className='text-lg text-slate-500'>Description</h2>
									<Textarea
										placeholder='Write a brief description of the property...'
										name='description'
										onChange={handleChange}
										defaultValue={listing?.description}
									/>
								</div>
								<div className='pt-4 '>
									<h2 className='font-lg text-gray-500 my-2'>Upload Property Images</h2>
									<FileUpload
										setImages={(value: any) => setImages(value)}
										imageList={listing.listingImages}
									/>
								</div>
								<div className='flex gap-7 justify-end mt-4'>
									<Button disabled={loading} variant={"outline"} className='text-gray-500'>
										{loading ? <Spinner /> : 'Save '}
									</Button>
									

									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button type='button' disabled={loading} className='text-gray-200'>
												{loading ? <Spinner /> : 'Save & Publish'}
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to list this property?
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() =>publishBtnhandler()}
												>
													{loading ? <Spinner /> : "Continue"}
													</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	)
}
