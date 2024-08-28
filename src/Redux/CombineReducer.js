// import { combineReducers } from 'redux';
// import OrderReducer from './OrderReducer';


// const rootReducer = combineReducers({
//   Order: OrderReducer,
// });

// export default rootReducer;

import { combineReducers } from 'redux';
import CreateCustomerReducer from "./HomeCreateCustomerCompanyInfoSend";
import CreateCustomerProfileReducer from "./HomeCreateCustomerProfileSend";
import HomeCategoryList from "./SendCategoryList";
import HomeCompanyImage from "./SendCompanyImage";
import HomePersonalPhotoImage from "./SendPersonalPhoto";
import HomeTransporterList from "./SendTransporterList";

const rootReducer = combineReducers({

  // Home Create Customer Combine Reducer
  sendCompanyInfo: CreateCustomerReducer,
  sendProfileInfo: CreateCustomerProfileReducer,
  // sendRoleList: HomeRoleList,
  sendTransporterList: HomeTransporterList,
  sendCategoryList: HomeCategoryList,
  sendCompanyImage: HomeCompanyImage,
  sendPersonalPhoto: HomePersonalPhotoImage,
  // sendEditId: EditCustomerById,

  //  User Data Combine Reducer
  // sendUserProfileData:CreateUserProfileReducer,
  // sendUserReferenceData:CreateUserReferenceReducer,
  // sendUserWorkingData:CreateUserWorkingReducer,
  // sendUserOfficialData:CreateUserOfficialReducer,
  // sendProfileImage:SendProfileImageReducer,
  // sendUserRuleList:UserRuleList,
  // sendUserEditId:UserEditId,

  // Product Data Combine Reducer
  // sendProductCategoryList:ProductCategoryList,
  // sendProductWareHouseList:ProductWareHouseList,
  // sendProductUnit:ProductUnitList,
  // sendProductList:ProductList,
  // sendCompanyData:CompanyData,
  // sendCustomerData:sendCustomerData,
  // Add other reducers if needed
});

export default rootReducer;
