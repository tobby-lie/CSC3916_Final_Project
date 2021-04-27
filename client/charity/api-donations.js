const listByCharity = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/donations/from/' + params.charityId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
 
  const listByOwner = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/charities/' + params.charityId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
      }
    })
      
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const listByName = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/donations/by/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
      }
    })
      // console.log("NAME", response.json())
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  export { listByCharity, listByOwner, listByName }