import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import * as Yup from 'yup'
import { request } from '../api/request'
import Page from '../layouts/Page'

const cloumns = [
    {
      field : 'id',
      headerName : 'ID',
      width : 50
    },
    {
        field : 'from',
        headerName : 'From',
        type : 'number',
        editable : true,
    },
    {
        field : 'to',
        headerName : 'To',
        type : 'number',
        editable : true,
    }
  ]
  
  const getAgeSectionsFromServer = () => {
    return request({
        url : '/age-section'
    })
}

const validationSchema = Yup.object({
  from : Yup.number().required('name field is requied'),
  to : Yup.number().required('image field is requied'),
})


const AgeSection = () => {
  const navigate = useNavigate()
    const ageSectionsQuery = useQuery({
        queryKey : ['get-age-sections-from-server'],
        queryFn : getAgeSectionsFromServer
    })

    if(ageSectionsQuery.isLoading){
        return <CubeLoader />
      }
    
      if(ageSectionsQuery.isError){
        if(ageSectionsQuery.error.response){
          if(ageSectionsQuery.error.response.status === 401){
            return navigate('/auth/signin')
          }
        }else if(ageSectionsQuery.error.request){
          return "no response receved from server"
        }else{
          return "unknown error with message" + ageSectionsQuery.error.message
        }
      }
  return (
    <Page 
    name={'age-sections'} 
    data={ageSectionsQuery.data.data.data} 
    columns={cloumns}
    link={{
      path : 'age-section'
    }}
    formInputs={[
      {
        name : 'from',
        lable : 'From',
        type : 'number',
        initialValues : '',
        fullWidth : true
      },
      {
        name : 'to',
        lable : 'To',
        type : 'number',
        fullWidth : true
      },
    ]}
      initialValues={{
        from : 0,
        to : 0,
      }}
        validationSchema={validationSchema}
        valuesShouldUpdate={['from' , 'to']}
        updateAPI={'/age-section'}
        withNavigate={false}
    />
  )
}

export default AgeSection