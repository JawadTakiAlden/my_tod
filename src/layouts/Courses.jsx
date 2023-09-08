import React from 'react'
import Page from './Page'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { request } from '../api/request'
import { useQuery } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

const courseColumns = [
  {
      field : 'id',
      headerName : 'ID',
      width : 50
  },
  {
      field : 'name',
      headerName : 'Name',
      width : 150,
      editable : true
      // flex : 1
  },
  {
      field : 'description',
      headerName : 'Descritpion',
      width : 150,
      editable : true
  },
  {
    field : 'image',
    headerName : 'Image',
    align : 'center',
    headerAlign : 'center',
    renderCell : (params) => {
      return <Box>
        <Box
          sx={{
            width : '40px',
            height : '40px',
            borderRadius : '20px 20px 20px 20px',
            backgroundImage : `url(http://127.0.0.1:8000${params.row.image})`,
            backgroundSize : 'cover',
            backgroundPosition : 'center',
            backgroundRepeat : 'no-repeat'
          }}
        >

        </Box>
      </Box>
    }
  }
]


const validationSchema = Yup.object({
  name : Yup.string().required('name field is required'),
  description : Yup.string().required('name field is required'),
  image : Yup.string().required('image fiels is required')
})

const getCourcesFromServer = () => {
  return request({
    url : '/course',
    method : 'get'
  })
}

const Courses = () => {
  const navigate = useNavigate()
  const {isLoading , isError , error , data , refetch} = useQuery({
    queryKey : ['get-courses-from-server'],
    queryFn : getCourcesFromServer
  })

  if(isLoading){
      return <CubeLoader />
    }
    
    if(isError){
      if(error.response.status === 401){
        navigate('/auth/signin')
      }else{
        refetch()
      }
    }

  return (
    <Page 
      name={'course'} 
      data={data.data.courses || []} 
      columns={courseColumns}
      link={{
        path : 'course'
      }}
      formInputs={[
        {
          name : 'name',
          lable : 'Name',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'description',
          lable : 'Description',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'image',
          lable : 'Image',
          type : 'file',
          initialValues : '',
          fullWidth : true
        },
      ]}

      initialValues={{
        name : '',
        description : '',
        image : '',
        imageFile : ''
      }}

      validationSchema={validationSchema}
      valuesShouldUpdate={['name' , 'description']}
    />
  )
}

export default Courses