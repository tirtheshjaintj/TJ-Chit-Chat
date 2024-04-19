import React, { useEffect, useState } from 'react'
import { VStack, Button,useToast} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function Signup() {
    const toast = useToast();
    const cookies = new Cookies();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const [cred, setCred] = useState({
        email: "",
        password: "",
        name: "",
        confirmpassword: "",
        pic: ""
    });
    const postdetails =async (pics) => {
        // console.log(pics);
        if(pics===undefined){
            // console.log(pics);
            toast({
                title: 'Image Not Uploaded.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
              })
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
              setLoading(true);
              const formData=new FormData();
              formData.append("file",pics);
              formData.append("upload_preset","chat-app");
              formData.append("cloud_name","dsjxlgzdb");
              const response=await axios.post("https://api.cloudinary.com/v1_1/dsjxlgzdb/image/upload",formData);
              const data=response.data;
              return data.url.toString();
        }
        else{
            toast({title: 'Image Not Supported.',status: 'warning',duration: 2000,isClosable: true});
        }
        setLoading(false);
        return null;
    }
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
    }
    const handleClick = () => {
        setShow(!show);
    }
    const handleClick2 = () => {
        setShow2(!show2);
    }
    const submitHandler = async () => {
        // setLoading(true);
        const config={
            headers:{
               "Content-Type":"application/json"
            }
        }
        if(!cred.name||!cred.email||!cred.password||!cred.confirmpassword){
        toast({title: 'Please Fill all fields Correctly',position: 'bottom-right',status: 'warning',duration: 2000,isClosable: true});
        }
        else if(cred.password.replaceAll(" ","").length<5){
            toast({title: 'Password too short must be atleast 5 characters',position: 'bottom-right',status: 'warning',duration: 2000,isClosable: true})        
        }
        else if(cred.password!=cred.confirmpassword){
            toast({title: 'Password Does Not Match',position: 'bottom-right',status: 'warning',duration: 2000,isClosable: true})        
        }
        else{
            try{
                const check=await axios.post("/api/user/checkUser",cred,config);
                // console.log(check);
                if(document.getElementById("pic").files.length>0){
                    // console.log("Uploading");
                    let result=await postdetails(document.getElementById("pic").files[0]);
                    if(result){
                        cred.pic=result;
                        const response=await axios.post("/api/user/signup",cred,config);
                        // console.log(response);
                        cookies.set("auth-token",response.data.token);
                        localStorage.setItem("userInfo",JSON.stringify(response.data));
                        toast({title: 'Registration Successful',position: 'bottom-right',status: 'success',duration: 2000,isClosable: true});   
                        // navigate('/chats');   
                    }
                    else{
                    setLoading(false);
                    return;
                    }
                }
                else{
                    setCred({...cred,pic:undefined});
                    // console.log(cred);
                    // console.log("Sending");
                    const response=await axios.post("/api/user/signup",cred,config);
                    // console.log(response);
                    cookies.set("auth-token",response.data.token);
                    localStorage.setItem("userInfo",JSON.stringify(response.data));
                    toast({title: 'Registration Successful',position: 'bottom-right',status: 'success',duration: 2000,isClosable: true});     
                    // navigate('/chats');   
                }
            }
            catch(error){
            const error_arr=error.response.data.errors;
            // console.log(error);
            error_arr.forEach((elem)=>{
                toast({title: elem.msg,status: 'warning',duration: 2000,isClosable: true})        
            })
            }
        }
        // console.log(cred);
        setLoading(false);
    }

useEffect(()=>{
  const uploadInput = document.getElementById('pic');
  const preview = document.getElementById('preview');
  uploadInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const imageUrl = event.target.result;
        preview.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image" />`;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = '';
    }
  });
})

    return (
        <>
            <VStack
                spacing={3}
                align='stretch'
                color='black'
            >
                {/* Name Input */}
                <FormControl id='first-name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' placeholder="Enter Your Name" name="name" value={cred.name} onChange={onChange}>
                    </Input>
                </FormControl>

                {/* Email Input */}
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="Enter Your Email" name="email" value={cred.email} onChange={onChange} />

                </FormControl>

                {/* Password Input */}
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup> 
                        <Input minLength={5} type={!show ? 'password' : 'text'} placeholder="Enter Your Password" name="password" value={cred.password} onChange={onChange} />
                        <InputRightElement
                            width="4.5rem"
                        >
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>

                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/*Confirm Password Input */}

                <FormControl id='confirmpassword' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input minLength={5} type={!show2 ? 'password' : 'text'} placeholder="Enter Your Password" name="confirmpassword" value={cred.confirmpassword} onChange={onChange} />
                        <InputRightElement
                            width="4.5rem"
                        >
                            <Button h='1.75rem' size='sm' onClick={handleClick2}>
                                {show2 ? "Hide" : "Show"}
                            </Button>

                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* Profile Pic Input */}
                <FormControl id='pic'>
                    <FormLabel>Upload Profile Picture
                    <div id="preview"><img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"  alt="Uploaded Image" /></div>
                    </FormLabel>
                    <Input type='file' p={1.5} id="pic" name="pic" accept='image/*' display="none">
                    </Input>
                </FormControl>
                <Button
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    SignUp Now !
                </Button>
            </VStack>
        </>
    )
}
