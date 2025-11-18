import { Navigate } from "react-router-dom";

export default function CustomerProtected({ children }: { children: JSX.Element }) {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch {
    return <Navigate to="/" replace />;
  }

  // Check required fields
  if (!user.name || !user.mobile || !user.pincode) {
    return <Navigate to="/" replace />;
  }

  return children;
}
