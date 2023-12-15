/**
 * Author: Libra
 * Date: 2023-12-06 09:50:52
 * LastEditors: Libra
 * Description:
 */
import { getUserInfoApi } from "@/api/user";
import { setUserInfo } from "@/store/user";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

export const AdminView: React.FC = () => {
  const dispatch = useDispatch();

  const getUserInfo = useCallback(async () => {
    const res = await getUserInfoApi();
    if (res.code === 200) {
      console.log(res.data);
      dispatch(setUserInfo(res.data));
    }
  }, [dispatch]); // dispatch is stable and won't cause unnecessary re-renders

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]); // Now getUserInfo is a dependency

  return <div>admin</div>;
};
