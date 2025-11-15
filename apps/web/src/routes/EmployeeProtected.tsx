import { Navigate } from "react-router-dom";

export default function EmployeeProtected({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/" replace />; // send to user login
  }

  return children;
}
