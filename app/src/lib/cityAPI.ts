import axios from "axios";
import * as dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const URL = "https://countriesnow.space/api/v0.1"; //process.env.CITY_API!;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCountries = async () => {
    //console.log('HI ',URL);
    
  const res = await axios.get(`${URL}/countries`);
  return res.data.data.map((c: any) => c.country);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getStates = async (country: string) => {
  const res = await axios.post(`${URL}/countries/states`, { country });
  return res.data.data.states.map((s: any) => s.name);
};

export const getCities = async (country: string, state: string) => {
    const res = await axios.post(`${URL}/countries/state/cities`, {country, state});
    console.log(JSON.stringify(res));
    return res.data.data;
}
