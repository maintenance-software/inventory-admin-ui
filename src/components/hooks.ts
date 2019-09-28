import { useState, useEffect } from "react";
import axios from 'axios';

const useFetch = (url: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrl = async () => {
    const response: any = await axios.get(url);
    console.log(response.data);
    setData(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}
export { useFetch };