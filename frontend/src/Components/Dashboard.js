import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Heading,
  Text,
  VStack,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input 
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addpostid, addtoken } from "../Store/Slice/Userslice";
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import Carousel from "./Carousel";

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const Dashboard = () => {
  const [post, setPost] = useState([]);
  const navigate = useNavigate();
  const [user, setuser] = useState([]);
  const dispatch = useDispatch();
  let admin = '';
  let token = localStorage.getItem("token");
  dispatch(addtoken(token));
  const id = useSelector(state => state.userdata._id);

  async function findPosts() {
    try {
      const res = await axios.get("http://localhost:8080/api/v2/getAllPosts")
        .catch((err) => console.log(err));
      if (!res) {
        navigate("/login");
      }
      const data = res.data.allposts;
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const handleclick = (id) => {
    dispatch(addpostid(id));
    navigate(`/singlepost/${id}`);
  }

  const findadmin = async () => {
    let res = await axios.get(`http://localhost:8080/api/v1/getuser/${id}`)
      .catch((error) => console.log(error));
    let { role } = res.data.user;
    return res.data.user;
  }

  useEffect(() => {
    findadmin().then((data) => setuser(data)).catch((error) => console.log("Findamin nhi chala"));
    findPosts().then((data) => setPost(data)).catch((err) => console.log("findposts nhi chala"));
    if (user.role == "admin") {
      admin = "admin";
    }
  }, []);

  const [inputVisible, setInputVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputBg = useColorModeValue('white', 'gray.700');

  const handleToggle = () => {
    setInputVisible(!inputVisible);
  };

  const findCategory = async () => {
    let res = await axios.post(`http://localhost:8080/api/v2/findcategorie`, {
      category: searchTerm
    }).catch((err) => console.log("connect nhi hua"));
    return res.data.post.length == 0 ? post : res.data.post;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      findCategory().then((data) => setPost(data)).catch((err) => console.log("Search nhi chala"));
      handleToggle();
    }
  };

  return (
    <VStack>
      <HStack width="100%" height="100vh" padding={"30px"}>
        <VStack height="100%" m={10}>
          <Carousel />
          <Flex
            align="center"
            justify="space-between"
            bg="gray.100"
            p={4}
            borderRadius="md"
            width="100%"
          >
            <Avatar name="John Doe" src="https://via.placeholder.com/150" />
            <Box ml={4}>
              <Text fontSize="xl">{user.username}</Text>
              <Text fontSize="sm" color="gray.600">
                {user.email}
              </Text>
            </Box>
            {
              user.role === "admin" ? <Link to='/adminpanel'><Button colorScheme="teal" variant="outline" size="sm">
                See all users
              </Button></Link> : ""
            }
          </Flex>
        </VStack>

        <VStack
          id="add"
          width="60%"
          height="100%"
          overflowY="auto"
          css={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          <HStack spacing={4}>
            <MotionIconButton
              icon={inputVisible ? <CloseIcon /> : <SearchIcon />}
              onClick={handleToggle}
              aria-label="Search"
              initial={{ rotate: 0 }}
              animate={{ rotate: inputVisible ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <MotionBox
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: inputVisible ? '200px' : 0, opacity: inputVisible ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              overflow="hidden"
            >
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search..."
                  bg={inputBg}
                  _placeholder={{ color: 'gray.500' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </InputGroup>
            </MotionBox>
          </HStack>
          {post && post.map((posts, index) => (
            <MotionBox
            key={posts._id}
            direction={{ base: "column", sm: "row" }}
            boxShadow="md"
            borderRadius="lg"
            overflow="visible"
            variant="outline"
            width="400px"  // Adjusted width to 400px
            height="600px" // Adjusted height to 600px
            position="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <HStack px={4} py={2} spacing={4} width="100%" height="100%">
              <Image
                objectFit="cover"
                maxW="200px"
                maxH="200px"
                src={posts.image}
                alt="Pet Image"
              />
              <VStack align="start" spacing={2} flex="1" maxW="calc(100% - 200px)" py={4}>
                <Heading size="md">{posts.name}</Heading>
                <Heading size="md">{posts.categories}</Heading>
                <Text>{posts.content.split(" ").slice(0, 10).join(" ")}...</Text>
              </VStack>
            </HStack>
            <Button
              variant="solid"
              colorScheme="blue"
              position="absolute"
              bottom="4"
              right="4"
              fontSize="sm"
              width="100px"
              height="40px"
              lineHeight="40px"
              borderRadius="md"
              onClick={() => handleclick(posts._id)}
            >
              Adopt it
            </Button>
          </MotionBox>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Dashboard;
