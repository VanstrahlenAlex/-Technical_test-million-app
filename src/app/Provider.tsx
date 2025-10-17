import React from 'react'
import Header from './_components/Header'

export default function Provider({children} : {children: React.ReactNode}) {
  return (
	<div>
		<Header />
		<div className=''>
			{children}
		</div>
	</div>
  )
}
