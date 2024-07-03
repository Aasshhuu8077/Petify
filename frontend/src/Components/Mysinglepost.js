import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {HStack,Box,Image,Heading,Text,Button, Flex,Avatar,VStack, Container} from "@chakra-ui/react"
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { addpostid, addtoken } from "../Store/Slice/Userslice";
export const Mysinglepost = () => {
    const [post,setpost]=useState([])
    const [appliction,setapplication]=useState([])
    const navigate=useNavigate()
    const location=useLocation()
    let _id='';
    let arr=location.pathname.split('/')
      _id=arr[2]
    const dispatch=useDispatch()
  let token=localStorage.getItem("token")
  dispatch(addtoken(token))
  const id=useSelector(state=>state.userdata._id)
    const findpost=async()=>{
      let res=await axios.get( `http://localhost:8080/api/v2/getthispost/${_id}`,{withCredentials:true}).catch((error)=>console.log(error))
      let data=res.data.post
      return data
    }
    const findallplicatioins=async()=>{
        let res=await axios.get(`http://localhost:8080/api/v3/getapplicaton/${_id}`).catch((err)=>{
            console.log(err)
        })
        return res.data.allapplication
    }
    const handleapprove=async(userid,applicationid)=>{
      await axios.post(`http://localhost:8080/api/v4/createconversation`,{
        senderid:id,
        receiverid:userid
      
      }).catch((err)=>console.log(err))
      console.log(_id,applicationid)
      await axios.delete(`http://localhost:8080/api/v3/deleteapplication/${_id}/${applicationid}`).catch((err)=>console.log(err))
      navigate(`/messenger/${id}`)
    }
    useEffect(()=>{
      findpost().then((data)=>setpost(data))
      findallplicatioins().then((data)=>setapplication(data))
    },[])

    return (
    <Flex padding={4}>
        <Container>
        <Box
          flex="1"
            direction={{ base: "column", sm: "row" }}
            boxShadow="lg"
            padding={4}
            borderRadius="md"
            overflow="hidden"
            variant="outline"
            width="550px"
            // maxW="50%"
            // minH="100px"
            bg="white"
            border="1px solid #E2E8F0"
            _hover={{ boxShadow: "xl" }}
        >
            <Image
              objectFit="cover"
              width="full"
              maxH="300px"
              src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              alt="Caffe Latte"
            />
          <Box px={4} py={2} width="100%">
            <Heading size="md" mt={4} mb={2}>Name: {post.name}</Heading>
            <Heading size="sd" mt={4} mb={2}>Categorie: {post.categories}</Heading>
            <Text fontWeight="semibold" py="2">
              {post.content}
            </Text>
            <HStack spacing={4}>
              <Button variant="solid" colorScheme="blue">
                Buy Latte
              </Button>
            </HStack>
          </Box>
        </Box>
</Container>


<Container marginTop={0}>
        {
            appliction.map((item,index)=>{
                return <Box
                key={index}
                direction={{ base: "column", sm: "row" }}
                boxShadow="md"
                borderRadius="lg"
                overflow="visible"
                variant="outline"
                width="100%"
                position="relative"
                minW="400px"
                maxW="full" 
                minH="200px" // Set maximum width // Set fixed height
              >
                <HStack px={4} py={2} spacing={4} width=" 100%" height="100%"> 
                  <VStack align="start" spacing={2} flex="1" maxW="calc(100% - 200px)" py={4}>
                    <Heading size="md">{item.firstname}</Heading>
                    <Heading size="md">{item.lastname}</Heading>
                    <Box maxW="100%" overflow="hidden" overflowY="auto">
                      <Text>
                          {item.content}
                      </Text>
                    </Box>
                  </VStack>
                </HStack>
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      position="absolute"
                      bottom="4"
                      right="4"
                      fontSize="sm" // Set font size
                      width="100px" // Set fixed width
                      height="40px" // Set fixed height
                      lineHeight="40px" // Center button content vertically
                      borderRadius="md" // Apply border radius
                    >
                      Adopt it
                    </Button>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  position="absolute"
                  bottom="4"
                  right="4"
                  fontSize="sm" // Set font size
                  width="100px" // Set fixed width
                  height="40px" // Set fixed height
                  lineHeight="40px" // Center button content vertically
                  borderRadius="md" // Apply border radius
                  onClick={()=>handleapprove(item.
                    userid,item._id)}
                >
                  Approve it
                </Button>
              </Box>
            })
        }
        </Container> 
    </Flex>
  )
}