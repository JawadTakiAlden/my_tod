import { Box } from '@mui/material'
import React from 'react'
import StatsticsCards from '../layouts/StatsticsCards'
import ReadableCards from '../layouts/ReadableCards'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import { useNavigate } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import NetworkError from './Errors/NetworkError'

const getStatsticsFromServer = () => {
  return request({
    url : '/statistics',
    method : 'get'
  })
}

const Dashboard = () => {
  const navigate = useNavigate()
  const {data , isLoading , isError , error , refetch} = useQuery({
    queryKey : ['get-statstics-from*server'],
    queryFn : getStatsticsFromServer
  })

  if(isLoading){
    return <CubeLoader />
  }

  if(isError){
    if(error.response.status === 401){
      navigate('/auth/signin')
    }else if(error.message === "Network Error"){
      return <NetworkError />
    }else{
      refetch()
    }
  }
  return (
    <Box
      sx={{
        padding : '20px 0'
      }}
    >
      <StatsticsCards statstics={data?.data} />
      <ReadableCards />
    </Box>
  )
}

export default Dashboard