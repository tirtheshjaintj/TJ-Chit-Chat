import { Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
export default function ChatLoading() {
    const [isLoaded, setIsLoaded] = useState(false);
  return (
<Stack>
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
  <Skeleton height='45px' />
</Stack>
)
}
