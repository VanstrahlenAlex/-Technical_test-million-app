import React from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {  BedDouble } from 'lucide-react'


export default function FilterSection() {
  return (
	<div>
			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Bed" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="light">
						<h2 className='flex gap-2'><BedDouble />2+</h2>
						
						</SelectItem>
					<SelectItem value="dark">3+</SelectItem>
					<SelectItem value="system">4+</SelectItem>
				</SelectContent>
			</Select>

	</div>
  )
}
