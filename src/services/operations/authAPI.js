import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

// Helper function to handle API requests with toast management
const handleApiRequest = async (method, url, data = {}, token = null, options = {}) => {
  const toastId = toast.loading("Loading...");
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiConnector(method, url, data, { ...options, ...headers });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unexpected error occurred");
    }

    return response?.data;
  } catch (error) {
    console.error(`${url} API ERROR:`, error);
    toast.error(error?.response?.data?.message || "An error occurred");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// Action: Send OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const result = await handleApiRequest("POST", SENDOTP_API, { email, checkUserPresent: true });
    if (result) {
      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    }
    dispatch(setLoading(false));
  };
}

// Action: SignUp
export function signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const result = await handleApiRequest("POST", SIGNUP_API, {
      accountType, firstName, lastName, email, password, confirmPassword, otp
    });
    if (result) {
      toast.success("Signup Successful");
      navigate("/login");
    }
    dispatch(setLoading(false));
  };
}

// Action: Login
export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const result = await handleApiRequest("POST", LOGIN_API, { email, password });

    if (result) {
      toast.success("Login Successful");
      dispatch(setToken(result.token));
      const userImage = result?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${result.user.firstName} ${result.user.lastName}`;
      dispatch(setUser({ ...result.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(result.token));
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard/my-profile");
    }

    dispatch(setLoading(false));
  };
}

// Action: Logout
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

// Action: Get Password Reset Token
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const result = await handleApiRequest("POST", RESETPASSTOKEN_API, { email });
    if (result) {
      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    dispatch(setLoading(false));
  };
}

// Action: Reset Password
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const result = await handleApiRequest("POST", RESETPASSWORD_API, { password, confirmPassword, token });
    if (result) {
      toast.success("Password Reset Successfully");
      navigate("/login");
    }
    dispatch(setLoading(false));
  };
}
