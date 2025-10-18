"use client";
import React, { useEffect } from 'react'
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


export default function EditListing({params}: { params: { id: string } }) {
	const [date, setDate] = React.useState<Date>();
	const today = new Date()
	const futureDate = new Date()
	futureDate.setFullYear(today.getFullYear() + 10)

	// const params = useParams();

	const {user} = useUser();
	const router = useRouter()

	useEffect(()=>{
		console.log("params",params.id);
		user&&verifyUserRecord()
		
	},[user]);

	const verifyUserRecord = async () => {
		const email = user?.primaryEmailAddress?.emailAddress;
		// if we don't have an email, don't call supabase
		if (!email) return;

		const { data, error } = await supabase
			.from('listing')
			.select('*')
			.eq('createdBy', email)
			.eq('id', params.id)

		if (Array.isArray(data) && data.length <= 0) {
			router.replace('/')
		}
	}

	const onSubmitHandler= async(formValue: any)=>{

		const { data, error } = await supabase
			.from('listing')
			.update(formValue)
			.eq('id', params.id)
			.select()
		console.log(data);
		if(data){
			console.log(data);
			toast.success("The property was updated successfully")
		}
		
	}
  return (
	<div className='pt-30'>
		<div className='px-10 md:px-36 my-10 items-center justify-center h-screen'>
			<h2 className='font-bold text-2xl'>Enter some more details about your listing</h2>
			<Formik
				initialValues={{
					type: '',
					propertyType: '',
				}}
				onSubmit={(values) =>{
					console.log(values);
					onSubmitHandler(values)
				}}
			>
				{({
					values,
					handleChange,
					handleSubmit
				  }) => (
					<form onSubmit={handleSubmit}>
				<div className='p-8 rounded-lg shadow-md'>
					<div className='grid grid-cols-1 md:grid-cols-3'>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>Rent or Sell?</h2>
								<RadioGroup 
									defaultValue="none" 
									onValueChange={(v) =>values.type=v}

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
								onValueChange={(e) => values.propertyType=e}
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
								/>
						</div>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>Bathrooms</h2>
							<Input 
								type="number" 
								placeholder='e.g. 2' 
								name='bathroom'
								onChange={handleChange}
								/>
						</div>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>Year</h2>
							<Input 
								type="number" 
								placeholder='e.g. 2020' 
								name='builthIn'
								onChange={handleChange}
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
									>
										<CalendarIcon />
										{date ? format(date, "PPP") : <span>Pick a date</span>}
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
								/>
						</div>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>Lot Size</h2>
							<Input 
								type="number" 
								placeholder='e.g. 2' 
								name='lotSize' 
								onChange={handleChange}
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
								/>
						</div>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>Selling Price($)</h2>
							<Input 
								type="number" 
								placeholder='50000' 
								name='price'
								onChange={handleChange}
								/>
						</div>
						<div className='flex flex-col gap-2'>
							<h2 className='text-lg text-slate-500'>HOA (Per Month)($)</h2>
							<Input 
								type="number" 
								placeholder='2000' 
								name='hoa' 
								onChange={handleChange}
								/>
						</div>
					</div>
					<div className='flex flex-col gap-2 pt-4'>
						<h2 className='text-lg text-slate-500'>Description</h2>
						<Textarea 
							placeholder='Write a brief description of the property...' 
							name='description' 
							onChange={handleChange}
							/>
					</div>
					<div className='flex gap-7 justify-end mt-4'>
						<Button variant={"outline"} className='text-gray-500'>Save</Button>
						<Button  className='text-gray-200'>Save & Publish</Button>
					</div>
				</div>
					</form>
				)}
			</Formik>
		</div>
	</div>
  )
}
