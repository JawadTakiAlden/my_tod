import React from 'react'
import * as Yup from 'yup'
import Page from '../layouts/Page'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import { useNavigate } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const parentsColumns = [
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
      width : 200,
      // flex : 1
    },
    {
      field : 'phone',
      headerName : 'Phone',
      width : 150,
      editable : true
      // flex : 1
    },
    {
        field : 'role',
        headerName : 'Role',
        width : 150,
        // flex : 1
    },
]

const validationSchema = Yup.object({
    first_name : Yup.string().required('first name field is required'),
    last_name : Yup.string().required('username field is required'),
    phone : Yup.string().required('phone field is required'),
    role_name : Yup.string().required('role field is required')
})


const getParentsFromServer = () => {
    return request({
        url : '/accounts?type=parent',
        method : 'get'
    })
}

const Parents = () => {
    const navigate = useNavigate()
    const {isLoading , isError , error , data , refetch } = useQuery({
        queryKey : ['get-parents-from-server'],
        queryFn : getParentsFromServer
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

    console.log(data)
  return (
    <Page 
    name={'parents'} 
    data={data.data.data} 
    columns={parentsColumns}
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
        initialValues : 'parents',
        fullWidth : true,
        valueOptions : [
          {name : 'parent' , value : 'parent'},
        ]
      },
    ]}
      initialValues={{
        first_name : '',
        last_name : '',
        phone : '',
        role_name : 'parent'
      }}
        validationSchema={validationSchema}
        valuesShouldUpdate={['first_name' , 'last_name' , 'phone']}
    />
  )
}



export default Parents