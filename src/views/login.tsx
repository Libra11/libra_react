/**
 * Author: Libra
 * Date: 2023-12-05 13:44:18
 * LastEditors: Libra
 * Description:
 */
import { RootState } from "@/store";
import { setToken } from "@/store/user";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

export function LoginView() {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <Button type="primary" onClick={() => dispatch(setToken("aaaaa"))}>
          ddd{token}
        </Button>
        <h1 className="text-6xl font-bold underline">Hello world!</h1>
      </div>
    </div>
  );
}
