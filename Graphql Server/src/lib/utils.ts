const verifyUser = async (token: string) => {
    try {
        const response = await fetch("http://localhost:5000/users/verify", {
            method: "POST",
            headers: { authorization: "Bearer " + token },
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Verification failed:", error);
        throw error;
    }
};

export default { verifyUser };
