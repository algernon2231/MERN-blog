import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Protected({ children }) {
    const [userInfo] = useContext(UserContext);
    if (!userInfo || Object.keys(userInfo).length === 0) {
        return <Navigate to="/" replace />;
    }
    return children;
}
export default Protected;
