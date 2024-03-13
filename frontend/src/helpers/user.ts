import Cookies from "js-cookie"

export interface User {
  id: number
  username: string
  mmr: number
  isAdmin: boolean
  wins: number
  losses: number
  profilePicture: string
}


export async function fetchUser (): Promise<User | null> {
  try {
    const jwtToken = Cookies.get('jwtToken') // Assuming you're using js-cookie or a similar library

    // Check if the token exists
    if (!jwtToken) {
      throw new Error('Authentication token not found. Please login first.')
    }

    // Make a GET request to the user endpoint
    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`, // Use the JWT token for authorization
        'Content-Type': 'application/json',
      },
    })
    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to fetch user data. Please check your authentication token.')
    }
    const userData = await response.json()
    // parse first 4 items of the response into currentUser
    return {
      id: userData.id,
      username: userData.username,
      mmr: userData.mmr,
      isAdmin: userData.isAdmin,
      wins: 10,
      losses: 5,
      profilePicture: "../assets/icon.png",
    }

  } catch (error: any) {
    console.error('Error:', error.message)
    return null
  }
}

export async function fetchAllUsers (): Promise<User[] | null> {
  try {
    const jwtToken = Cookies.get('jwtToken')
    if (!jwtToken) {
      throw new Error('Authentication token not found. Please login first.')
    }
    const response = await fetch('http://localhost:3000/api/v1/user/all', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user data. Please check your authentication token.')
    }
    return await response.json()
  } catch (error: any) {
    console.error('Error:', error.message)
    return null
  }
}