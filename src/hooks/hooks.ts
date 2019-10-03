import { useState, useEffect } from "react";
import { IUser } from "../api/users.api";

export const useFetch = (promise: Promise<IUser[]>) => {
  const [data, setData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    promise.then(users => {
      console.log(users);
      setData(users);
      setLoading(false);
    });    
  }

  useEffect(() => {
    fetchUser();
  }, []);
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