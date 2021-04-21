const create = async (params, credentials, charity) => {
    try {
      let response = await fetch('/api/charities/by/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: charity
      })
        return response.json()
      } catch(err) { 
        console.log(err)
      }
  }
  
  const list = async (signal) => { 
    //   approved
    try {
      let response = await fetch('/api/charities', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const listByOwner = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/charities/by/'+params.userId, {
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
  
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/charity/' + params.charityId, {
        method: 'GET',
        signal: signal,
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, charity) => {
    try {
      let response = await fetch('/api/charities/' + params.charityId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: charity
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/charities/' + params.charityId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    listByOwner,
    read,
    update,
    remove
  }
  