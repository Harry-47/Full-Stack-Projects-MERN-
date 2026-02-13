import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function (onClose) 
{
    const [searchParams, setSearchParams] =  useSearchParams();
    const [filters, setFilters] = useState({
        brand:searchParams.get('brand') || '',
        minPrice:searchParams.get('minPrice') || '',
        maxPrice:searchParams.get('maxPrice') || '',
        rating:searchParams.get('rating') || '',
        discount:searchParams.get('discount') || ''

    })

    useEffect(
        ()=> {
         setFilters(
            {
            brand : searchParams.get('brand') || '',
            minPrice : searchParams.get('minPrice') || '',
            maxPrice : searchParams.get('maxPrice') || '',
            rating : searchParams.get('rating') || '',
            discount : searchParams.get('discount') || ''
            }
         )
        }
    , [searchParams])
    
    function handleChange (e){
        setFilters({...filters, [e.target.name]: e.target.value})
    }

    function handleApply(){
       const newSearchParams = new URLSearchParams()
       Object.entries(filters).forEach(([key,value]) =>
         {
            (value && value.toString().trim()!=="") ? 
            (newSearchParams.set(key, value),
            newSearchParams.set('page','1')) : null
         }
         
       )
        if (newSearchParams.toString().trim().length > 0) {
            setSearchParams(newSearchParams);
            onClose();
        }
    }

    function handleClear(){
        setFilters({
            brand: '',
            minPrice: '',
            maxPrice: '',
            rating: '',
            discount: ''
        })
        setSearchParams({})
        onClose()
    }

   

    return { filters, handleChange, handleApply, handleClear };
}