import React, { useEffect, useState } from 'react';
import { Box, Image, Flex, Text, Button } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const petData = [
  {
    name: 'Buddy',
    image: 'https://cdn.shopify.com/s/files/1/0197/6814/8032/files/beagle_large.jpg?v=1572629393',
    description: 'Friendly and energetic dog looking for a loving home.',
    fact: 'Dogs can learn more than 1000 words!',
  },
  {
    name: 'Mittens',
    image: 'https://d2zp5xs5cp8zlg.cloudfront.net/image-83814-800.jpg',
    description: 'Calm and affectionate cat ready to cuddle.',
    fact: 'Cats can rotate their ears 180 degrees.',
  },
  {
    name: 'Chirpy',
    image: 'https://www.thoughtco.com/thmb/JsfFOm7ViQvLMfFDgiJ6LzmODGw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-128105870-589cfe9f5f9b58819c7385d1.jpg    ',
    description: 'Happy and singing bird needing a new friend.',
    fact: 'Birds are the only animals with feathers.',
  },
  // Add more pets as needed
];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + petData.length) % 3 );
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Flex justify="center" mb={4}>
        <Button onClick={handlePrev} mr={2}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </Flex>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            position="relative"
            width="600px"
            height="300px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              src={petData[index].image}
              alt={petData[index].name}
              objectFit="cover"
              width="100%"
              height="100%"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              width="100%"
              bgGradient="linear(to-t, rgba(0, 0, 0, 0.8), transparent)"
              color="white"
              p={4}
              zIndex={2}
            >
              <Text fontWeight="bold" fontSize="xl">
                {petData[index].name}
              </Text>
              <Text mt={2}>{petData[index].description}</Text>
              <Text mt={2} fontStyle="italic" color="gray.300">
                {petData[index].fact}
              </Text>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Carousel;
