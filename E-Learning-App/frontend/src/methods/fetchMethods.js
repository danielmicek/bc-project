import axios from "axios";

/*-------------COMMON API CLIENT----------------------------------------------------------------*/
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const asText = (data) => {
    if (typeof data === "string") return data;
    if (data === null || data === undefined) return "";
    return JSON.stringify(data);
};

function createApiClient(getToken){
    const apiClient = axios.create({
        baseURL: API_BASE_URL,
    });

    apiClient.interceptors.request.use(async (config) => {
        const token = await getToken();

        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    apiClient.interceptors.response.use(
        (response) => response.data,
        (error) => {
            if (!error.response) {
                return Promise.reject(error);
            }

            const apiError = new Error(asText(error.response.data) || error.message);
            apiError.status = error.response.status;
            /*apiError.data = error.response.data;
            apiError.statusText = error.response.statusText;*/

            return Promise.reject(apiError);
        }
    );

    return apiClient;
}

// for optimisation -> the same client is used in each method
// without this, for each call of a method, a new client would be created
const apiClientCache = new WeakMap();
function getApiClient(getToken){
    if (!apiClientCache.has(getToken)) {
        apiClientCache.set(getToken, createApiClient(getToken));
    }

    return apiClientCache.get(getToken);
}

/*-------------USER API CALLS----------------------------------------------------------------*/
export async function POST_user(clerk_id, email, username, imageUrl, getToken) {
    const apiClient = getApiClient(getToken);

    await apiClient.post("/api/user/addUser", {
        user_id: clerk_id,
        username,
        email,
        image_url: imageUrl,
    });
}

export async function GET_user(username, getToken){
    const apiClient = getApiClient(getToken);

    try {
        return await apiClient.get(`/api/user/getUser/${username}`);
    } catch (error) {
        if (error.status === 400 || error.status === 404) return null; // user not found
        throw error;
    }
}

export async function PUT_user(username, email, imageUrl, userId, getToken){
    const apiClient = getApiClient(getToken);

    const response = await apiClient.put("/api/user/putUser", {
        user_username: username,
        user_email: email,
        user_imageUrl: imageUrl,
        clerk_user_id: userId,
    });

    return asText(response);
}

export async function GET_UserScore(userId, getToken){
    const apiClient = getApiClient(getToken);
    return await apiClient.get(`/api/user/getUserScore/${userId}`);
}

export async function DELETE_deleteUserProfile(userId, getToken){
    const apiClient = getApiClient(getToken);
    return await apiClient.delete(`/api/user/deleteUserProfile/${userId}`);
}
/*----------------------------------------------------------------------------------------------*/

/*-------------FRIENDSHIP API CALLS----------------------------------------------------------------*/
export async function POST_friendship(userUsername, friendUsername, userId, friendId, getToken) {
    const apiClient = getApiClient(getToken);

    const response = await apiClient.post("/api/friendship/sendFriendRequest", {
        user_username: userUsername,
        friend_username: friendUsername,
        status: "PENDING",
        from: userId,
        user_id: userId,
        friend_id: friendId,
    });

    return asText(response);
}

// returns true if friendship exists, false otherwise
export async function GET_friendship(user_id, friend_id, getToken){
    const apiClient = getApiClient(getToken);

    try {
        await apiClient.get(`/api/friendship/getFriendship/${user_id}/${friend_id}`);
        return true;
    } catch (error) {
        if (error.status === 400) return false;
        throw error;
    }
}

export async function GET_allFriendRequests(userId, getToken){
    const apiClient = getApiClient(getToken);

    try {
        return await apiClient.get(`/api/friendship/getAllFriendRequests/${userId}`);
    } catch (error) {
        if (error.status === 404) return [];
        throw error;
    }
}

export async function GET_allFriends(userId, getToken){
    const apiClient = getApiClient(getToken);

    try {
        return await apiClient.get(`/api/friendship/getAllFriends/${userId}`);
    } catch (error) {
        if (error.status === 404) return [];
        throw error;
    }
}

export async function POST_acceptFriendRequest(userId, friendId, getToken){
    const apiClient = getApiClient(getToken);

    const response = await apiClient.post(`/api/friendship/acceptFriendRequest/${userId}/${friendId}`, null);
    return asText(response);
}

// backend currently exposes one delete route for friendship/request removal
export async function DELETE_deleteFriendship(userId, friendId, getToken){
    const apiClient = getApiClient(getToken);

    const response = await apiClient.delete(`/api/friendship/deleteFriendship/${userId}/${friendId}`);
    return asText(response);
}

export async function DELETE_deleteFriendRequest(userId, friendId, getToken){
    const apiClient = getApiClient(getToken);

    const response = await apiClient.delete(`/api/friendship/deleteFriendRequest/${userId}/${friendId}`);
    return asText(response);
}
/*----------------------------------------------------------------------------------------------*/

/*-------------TEST API CALLS----------------------------------------------------------------*/
export async function POST_getBestTestScore(tests, getToken) {
    const apiClient = getApiClient(getToken);

    const response = await apiClient.post("/api/test/getBestTestScore", { tests });
    return asText(response);
}

export async function GET_getTestByTestId(testId, getToken, userId){
    const apiClient = getApiClient(getToken);
    return await apiClient.get(`/api/test/getTestByTestId/${testId}/${userId}`);
}

export async function POST_submitTest(testStructure, testDifficulty, userId, testId, testSessionToken, setIsLoading, getToken) {
    const apiClient = getApiClient(getToken);
    setIsLoading(true);

    try {
        return await apiClient.post("/api/test/submitTest", {
            userId,
            testId,
            testStructure,
            testDifficulty,
            testSessionToken,
        });
    } finally {
        setIsLoading(false);
    }
}

export async function GET_getCertificateById(certId, getToken){
    const apiClient = getApiClient(getToken);
    return await apiClient.get(`/api/test/getCertificateById/${certId}`);
}

export async function POST_postCertificate(certId, username, userId, getToken) {
    const apiClient = getApiClient(getToken);

    return await apiClient.post("/api/test/postCertificate", {
        certId,
        username,
        userId
    });
}

export async function GET_allUsersTests(userId, getToken){
    const apiClient = getApiClient(getToken);
    try {
        return await apiClient.get(`/api/test/getAllUsersTests/${userId}`);
    } catch (error) {
        if (error.status === 404) {
            return { tests: [], bestScore: 0 };
        }
        throw error;
    }
}

export async function GET_createdTest(testDifficulty, testId, getToken, onOpenAiLimitModal = null) {
    const apiClient = getApiClient(getToken);

    try {
        return await apiClient.get(`/api/test/createTest/${testDifficulty}?testId=${encodeURIComponent(testId)}`);
    } catch (error) {
        //if (error.status === 429 && onOpenAiLimitModal) onOpenAiLimitModal();
        throw error;
    }
}
/*----------------------------------------------------------------------------------------------*/

/*-------------GET NOTION-ID--------------------------------------------------------------------*/
export async function GET_notionId(chapter, getToken) {
    const apiClient = getApiClient(getToken);
    return await apiClient.get(`/api/chapters/getNotionId/${chapter}`);
}
/*---------------------------------------------------------------------------------------------*/

/*-------------GET ALL CHAPTERS----------------------------------------------------------------*/
export async function GET_allChapters(getToken) {
    const apiClient = getApiClient(getToken);
    return await apiClient.get("/api/chapters/getAllChapters");
}
/*------------------------------------------------------------------------------------------*/

/*-------------GET AI LIMIT----------------------------------------------------------------*/
export async function GET_aiLimit(getToken) {
    const apiClient = getApiClient(getToken);
    return await apiClient.get("/api/test/getAiLimit");
}
/*---------------------------------------------------------------------------------------------*/
