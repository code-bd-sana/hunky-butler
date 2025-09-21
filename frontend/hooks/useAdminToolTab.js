import { useSelector, useDispatch } from "react-redux";
import { setTab } from "../features/AdminToolTab";


export const useAdminToolTab = () => {
  return useSelector((state) => state.adminToolTab.activeTab);
};

export const useSetAdminToolTab = () => {
  const dispatch = useDispatch();
  return (tabName) => dispatch(setTab(tabName));
};
