import React, { useState } from 'react'
import { VStack, Button,useToast} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function Login() {
  const toast = useToast();
  const cookies = new Cookies();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const [cred, setCred] = useState({
    email: "",
    password: ""
  });
  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
    //console.log(cred);
  }
  const submitHandler = async () => {
    const config={
      headers:{
         "Content-Type":"application/json"
      }
  }
    if(!cred.email||!cred.password){
      toast({title: 'Please Fill all fields Correctly',status: 'warning',duration: 2000,isClosable: true});
      }
      else if(cred.password.replaceAll(" ","").length<5){
          toast({title: 'Wrong Credentials',description:'Please check email and Password',position: 'bottom-right',status: 'warning',duration: 2000,isClosable: true})        
      }
      else{
        try{
          setLoading(true);
        const response=await axios.post("/api/user/login",cred,config);
        cookies.set("auth-token",response.data.token);
        setLoading(false);
        localStorage.setItem("userInfo",JSON.stringify(response.data));
        toast({title: 'Login Successful',status: 'success',position: 'bottom-right',duration: 2000,isClosable: true});     
        navigate("/chats");
        }
        catch(error){
          setLoading(false);
          console.log(error);
          const error_arr=error.response.data.errors;
          // //console.log(error);
          error_arr.forEach((elem)=>{
              toast({title: elem.msg,description:'Please check email and Password',position: 'bottom-right',status: 'warning',duration: 2000,isClosable: true})        
          })
          }
      }


  }
  const submitGuest = () => {
        setCred({email:"guest@example.com",password:"123456"});
  }
  const handleClick = () => {
    setShow(!show);
}
  return (
    <>
      <VStack
        spacing={5}
        align='stretch'
        color='black'
      >
        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter Your Email" name="email" value={cred.email} onChange={onChange} />
        </FormControl>
        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input type={!show ? 'password' : 'text'} placeholder="Enter Your Password" name="password" value={cred.password} onChange={onChange} />
            <InputRightElement
              width="4.5rem"
            >
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>

            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 10 }}
          onClick={submitHandler}
          isLoading={loading}
         >
          Login
        </Button>
        <Button
          colorScheme="red"
          width="100%"
          style={{ marginTop: 10 }}
          onClick={submitGuest}
        >
          Guest Credential ! 
        </Button>
      </VStack>
    </>
  )
}
