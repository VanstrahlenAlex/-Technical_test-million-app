import React from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {  Bath, BedDouble, CarFront } from 'lucide-react'


export default function FilterSection({ setBedCount, setBathCount, setParkingCount, setHomeType }: { setBedCount: any, setBathCount: any, setParkingCount: any, setHomeType: any }) {
  return (
	<div className='px-3 py-2 grid grid-cols-2 md:flex gap-2'>
			<Select onValueChange={setBedCount}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Bed" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='none' disabled>--Select N° bed--</SelectItem>
					<SelectItem value="2">
						<h2 className='flex gap-2'><BedDouble className='h-5 w-5 text-primary' />2+</h2>				
					</SelectItem>
					<SelectItem value="3">
						<h2 className='flex gap-2'><BedDouble className='h-5 w-5 text-primary' />3+</h2>				
					</SelectItem>
					<SelectItem value="4">
						<h2 className='flex gap-2'><BedDouble className='h-5 w-5 text-primary' />4+</h2>				
					</SelectItem>
				</SelectContent>
			</Select>
			<Select onValueChange={setBathCount}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Bath" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='none' disabled>--Select N° Bath--</SelectItem>
					<SelectItem value="2">
						<h2 className='flex gap-2'><Bath className='h-5 w-5 text-primary' />2+</h2>
					</SelectItem>
					<SelectItem value="3">
					  <h2 className='flex gap-2'><Bath className='h-5 w-5 text-primary' />3+</h2>
					</SelectItem>
					<SelectItem value="4">
					  <h2 className='flex gap-2'><Bath className='h-5 w-5 text-primary' />4+</h2>
					</SelectItem>
				</SelectContent>
			</Select>
			<Select onValueChange={setParkingCount}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Parking" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='none' disabled>--Select N° Parking--</SelectItem>
					<SelectItem value="2">
						<h2 className='flex gap-2'><CarFront className='h-5 w-5 text-primary' />2+</h2>
					</SelectItem>
					<SelectItem value="3">
					  <h2 className='flex gap-2'><CarFront className='h-5 w-5 text-primary' />3+</h2>
					</SelectItem>
					<SelectItem value="4">
					  <h2 className='flex gap-2'><CarFront className='h-5 w-5 text-primary' />4+</h2>
					</SelectItem>
				</SelectContent>
			</Select>

			<Select onValueChange={(value) =>value=='All'? setHomeType(null) : setHomeType}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Home Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='none' disabled>--Select Home Type--</SelectItem>
					<SelectItem value="All">
						All
					</SelectItem>
					<SelectItem value="Single_Family_House">
						Single Family Home
					</SelectItem>
					<SelectItem value="Town_House">
							Town House
					</SelectItem>
					<SelectItem value="Condo">
						Condo
					</SelectItem>
				</SelectContent>
			</Select>
	</div>
  )
}
