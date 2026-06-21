export const getToken = () => {
    return localStorage.getItem("token");
};
export const setToken = (token,user_id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id);
   
};
export const getUser = () => {
    return localStorage.getItem("user_id");
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};