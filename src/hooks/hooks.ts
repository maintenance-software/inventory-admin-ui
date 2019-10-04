import { useState, useEffect } from "react";

export const useFetch = (promise: Promise<any>, lang: string) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchLocalizations = () => {
    promise.then(localizations => {
      console.log(localizations);
      setData(localizations);
      setLoading(false);
    });    
  }

  useEffect(() => {
    fetchLocalizations();
  }, [lang]);
  return [data, loading];
}




/*
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
*/