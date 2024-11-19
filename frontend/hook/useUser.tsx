export const useUserID = async (userToken: string, id: number) => {
    return await fetch(process.env.EXPO_PUBLIC_API_URL + "/user/" + id, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Group-Authorization":
                process.env.EXPO_PUBLIC_API_GROUP_AUTHORIZATION || "",
            Authorization: "Bearer " + userToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
            return [];
        });
};
