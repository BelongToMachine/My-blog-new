const makeAuthenticatedRequest = async () => {
  try {
    const response = await fetch(
      "https://jie-blog.xyz/api/usecase/list?page=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer !Sevval77520!`,
          // Add this header to ensure it's not stripped by proxies
          "X-Forwarded-Authorization": `Bearer !Sevval77520!`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()
    console.log("Response:", data)
    return data
  } catch (error) {
    console.error("Error making request:", error)
    throw error
  }
}

makeAuthenticatedRequest()
