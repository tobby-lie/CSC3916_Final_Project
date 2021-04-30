import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import { listByCharity, listByOwner, listByName } from './api-donations'
import { read, update } from './api-charity.js'
//import ProductOrderEdit from './ProductOrderEdit'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: '#434b4e',
    fontSize: '1em'
  },
  customerDetails: {
    paddingLeft: '36px',
    paddingTop: '16px',
    backgroundColor: '#f8f8f8'
  },
  checkout: {
    float: 'right',
    margin: '8px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  }

}))

export default function CharityDonations({ match }) {
    const classes = useStyles()
    const [orders, setOrders] = useState([])
    const [values, setValues] = useState({
      name: '',
      description: '',
      image: '',
      redirect: false,
      error: '',
      id: ''
  })
    const [owner, setOwner] = useState({
      name: ''
    })
    const jwt = auth.isAuthenticated()
    useEffect(() => {
      
      const abortController = new AbortController()
      const signal = abortController.signal
      listByCharity({
        charityId: match.params.charityId
      }, {t: jwt.token}, signal).then((data) => {
        if (data.error) {
          console.log(data)
        }else if (data.success === false)
        {
          return (<Redirect to={'/charity/charities'}/>)
        }else {
          
            setOrders(data.donation)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    
    }, [])

    useEffect(() =>{
      
      const abortController = new AbortController()
      const signal = abortController.signal
      listByOwner({
        charityId: match.params.charityId
      }, { t: jwt.token }, signal).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, 'redirect': true })
        } else {
          setValues({ ...values, name: data.charity[0].name })
        }
      })

      // let count = 0;
      
      // listByName({
      //   userId: orders
      // }, {t: jwt.token}, signal).then((data) => {
      //   if (data.error) {
      //     setOwner({...owner, error: data.error})
      //   } else {
      //     console.log("DATA", data)
      //     setOwner({...owner, name: data.charity[0].name})
      //   }
      // })
      return function cleanup(){
        abortController.abort()
      }
    
      
    }, [])
    
    console.log("VALUES", values)
    console.log("Orders", orders)
    console.log("OWNER", owner)
    //console.log("PARAMS", params)

    if (values.redirect) {
      return (<Redirect to={'/charity/charities'}/>)
    }

    const handleChange = (event) => {
    let userId = event
    console.log("USERID", userId)
    const abortController = new AbortController()
    const signal = abortController.signal
    listByName({
      userId: userId
    }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        setOwner({ ...owner, error: data.error })
      } else {
        setOwner({ ...owner, name: data[0].owner.name })
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }

  if (values.redirect) {
    return (<Redirect to={'/charity/charities'} />)
  }

  const getTotal = () => {
    return orders.reduce((amount, b) => {
      return amount + b.amount
    }, 0)
  }

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Donations for {values.name}
        </Typography>
        <List dense >
          {orders.map((order, index) => {
            return   <span key={index}>
                <Typography type="title" className={classes.subheading}>
                   Name: {order.results[0].name} 
                </Typography>
                <Typography type="title" className={classes.subheading}>
                   Email: {order.results[0].email}
                </Typography>
                <Typography type="title" className={classes.subheading}>
                   Amount: ${Math.round((order.amount) * 100) / 100} 
                </Typography>
                {/*<ListItemText  primary={order.results[0].name} secondary={'$' + Math.round((order.amount) * 100) / 100} />*/}
                
            </span>})
          }
          <div className={classes.checkout}>
            <span className={classes.total}>Total: ${Math.round((getTotal()) *100 ) / 100}</span>
          </div>
        </List>
      </Paper>
    </div>
  )
}
