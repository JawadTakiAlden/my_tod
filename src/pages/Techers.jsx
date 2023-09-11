import React from 'react'
import Page from '../layouts/Page'
import * as Yup from 'yup'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useNavigate } from 'react-router'


const techersColumns = [
  {
      field : 'id',
      headerName : 'ID',
      width : 50
  },
  {
      field : 'first_name',
      headerName : 'First Name',
      width : 150,
      editable : true
      // flex : 1
  },
  {
      field : 'last_name',
      headerName : 'Last Name',
      width : 150,
      editable : true
      // flex : 1
  },
  {
    field : 'username',
    headerName : 'Username',
    width : 150,
    editable : true
    // flex : 1
},
  {
      field : 'phone',
      headerName : 'Phone Number',
      editable : true,
      width : 150
  },
  {
      field : 'role',
      headerName : 'Role',
      width : 150
  }
]


const validationSchema = Yup.object({
  first_name : Yup.string().required('first name field is required'),
  last_name : Yup.string().required('last name field is required'),
  role_name : Yup.string().required('age field is required'),
  phone : Yup.string().min(10).max(10).required('phone number field is required'),
})

const getTeachersFromServer = () => {
  return request({
    url : '/accounts?type=stuff',
    method : 'get'
  })
}

const Techers = () => {
  const navigate = useNavigate()
  const {isLoading , isError , error , data , refetch} = useQuery({
    queryKey : ['get-teachers-from-server'],
    queryFn : getTeachersFromServer
  })

  if(isLoading){
      return <CubeLoader />
    }
    
    if(isError){
      if(error.response.status === 401){
        navigate('/auth/signin')
      }else if(error.message === "Network Error"){
        return 'network error'
      }else{
        refetch()
      }
    }
  return (
    <Page 
      name={'stuff'} 
      data={data.data.data} 
      columns={techersColumns}
      link={{
        path : 'accounts'
      }}
      formInputs={[
        {
          name : 'first_name',
          lable : 'First Name',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'last_name',
          lable : 'Last Name',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'phone',
          lable : 'Phone',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'role_name',
          lable : 'Role',
          type : 'select',
          initialValues : 'teacher',
          fullWidth : true,
          valueOptions : [
            {name : 'teacher' , value : 'teacher'},
            {name : 'admin' , value : 'admin'},
            {name : 'doctor' , value : 'doctor'},
            {name : 'social' , value : 'social'},
            {name : 'extra' , value : 'extra'},
          ]
        },
      ]}
      initialValues={{
        first_name : '',
        last_name : '',
        phone : '',
        role_name : 'teacher'
      }}
      validationSchema={validationSchema}
      valuesShouldUpdate={['first_name' , 'last_name' , 'phone']}
      updateAPI={'/accounts'}
    />
  )
}

export default Techers