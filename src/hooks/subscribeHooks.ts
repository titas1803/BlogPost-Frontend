import { logout } from "@/slices/loginSlice";
import { AppDispatch, AppState } from "@/store/store";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export const useSubscribe = () => {
  const authToken = useSelector((state: AppState) => state.login["auth-token"]);

  const dispatch = useDispatch<AppDispatch>();
  const SUBSCRIBEURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL + `/sub/subscribe/`;
  if (!authToken) dispatch(logout());

  return async (userid: string) => {
    const resonse = await axios.put(`${SUBSCRIBEURL}${userid}`, undefined, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return resonse;
  };
};

export const useUnSubscribe = () => {
  const authToken = useSelector((state: AppState) => state.login["auth-token"]);

  const dispatch = useDispatch<AppDispatch>();
  const SUBSCRIBEURL =
    import.meta.env.BLOGPOST_FRONTEND_API_URL + `/sub/unsubscribe/`;
  if (!authToken) dispatch(logout());

  return async (userid: string) => {
    const resonse = await axios.put(`${SUBSCRIBEURL}${userid}`, undefined, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return resonse;
  };
};
