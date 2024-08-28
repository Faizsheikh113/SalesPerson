import axios from 'axios';
import { setSendCategoryListData,setSendRoleListData, setSendTransporterListData } from '../src/Redux/ActionType';

export const baseUrl = 'https://customer-node.rupioo.com';

export const fetchTransporterList = async (database, dispatch) => {
    // const dispatch = useDispatch();
    // console.log("API CALL", database);
    // const { userId, database } = useSelector((state) => state.app);

    try {
        const res = await axios.get(`${baseUrl}/transporter/view-transporter/${database}`);

        if (res.status === 200) {
            const data = res.data.Transporter;
            // console.log('AAAA Transporter :- ', res.data);
            dispatch(setSendTransporterListData(data));
        } else {
            showErrorAlert("Failed to get data");
        }
    } catch (err) {
        console.error(err);
        showErrorAlert("Error occurred while getting the data");
    }
};
export const fetchRoleListData = async (database, dispatch) => {
    // console.log('faiz',database);
    try {
        const response = await axios.get(`${baseUrl}/role/get-role/${database}`);
        // console.log('ROLE DATA !!!!!!!!!!!!!! :-', response.data);
        // console.log("Faiz")

        if (response.status === 200) {
            const data = response.data;
            // console.log("RoleList :- ",data);
            dispatch(setSendRoleListData(data))
        } else {
            showErrorAlert("Failed to get data");
        }
    } catch (err) {
        console.error(err);
        showErrorAlert("Error occurred while getting the data");
    }
};
export const fetchCategoryListData = async (database, dispatch) => {
    // console.log('faiz :-----------',database);
    try {
        const response = await axios.get(`${baseUrl}/customer-group/view-customer-group/${database}`);
        // console.log('ROLE DATA', response.data);
        // console.log("Faiz")

        if (response.status === 200) {
            const data = response.data;
            // console.log("Category List 1111 :- ",data);
            dispatch(setSendCategoryListData(data))
        } else {
            showErrorAlert("Failed to get data");
        }
    } catch (err) {
        console.error(err);
        showErrorAlert("Error occurred while getting the data");
    }
};