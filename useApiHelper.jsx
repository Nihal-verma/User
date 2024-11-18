import { useState } from 'react';
import {useNavigate} from "react-router-dom"
const baseURL = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'

const useApiHelper = () => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("UserToken")
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}`,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      });
     const jsonData = await response.json()
  
      return jsonData;
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDataWithoutAuth = async (endpoint) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetchDataWithoutAuth:", error.message);
      setError(error.message); // Ensure setError is defined in this scope
      return { success: false, message: error.message };
    }
  };


  const postData = async (endpoint, postData) => {
    try {
      const response = await fetch(`${baseURL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const responseData = await response.json();
      // console.log("responseData",responseData);
      return responseData;
    } catch (error) {
      setError(error.message);
    }
  };

  return { fetchData,fetchDataWithoutAuth, postData, error };
};

export default useApiHelper;
