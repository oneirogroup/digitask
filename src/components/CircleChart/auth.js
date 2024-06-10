export const getUserToken = async (email, password) => {
  try {
    const response = await fetch("http://135.181.42.192/accounts/gettoken/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Token alınamadı.");
    }

    const data = await response.json();
    return data.access; 
  } catch (error) {
    console.error("Token alınamadı:", error);
    return null;
  }
};
