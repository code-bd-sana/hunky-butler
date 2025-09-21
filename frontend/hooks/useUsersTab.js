import { useSelector, useDispatch } from "react-redux";
import { setTab } from "../features/userTab";

export const useActiveTab = () => {
  return useSelector((state) => state.usersTab.activeTab);
};


export const useSetTab = () => {
  const dispatch = useDispatch();
  return (tabName) => dispatch(setTab(tabName));
};
