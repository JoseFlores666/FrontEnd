import  { useEffect, useState } from 'react'

export default function useFetch(url, options = {},reload=false) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(url, options);
          const responseData = await response.json();
          setData(responseData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [reload]);
  
    return { data, loading };
  }