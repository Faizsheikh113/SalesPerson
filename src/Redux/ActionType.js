export const setOrderData = (OrderArr) => ({
  type: 'Set_OrderArr',
  payload: OrderArr,
});

export const setSendCategoryListData = (CategoryList) => ({
  type: 'SEND_CategoryList',
  payload: CategoryList,
})

export const setSendRoleListData = (RoleList) => ({
  type: 'SEND_RoleList',
  payload: RoleList,
})

export const setSendTransporterListData = (TransporterList) => ({
  type: 'SEND_TransporterList',
  payload: TransporterList,
})

// Ye alag hai

export const setSendCompanyData = (CompanyInfo) => ({
  type: 'SEND_COMPANYINFO',
  payload: CompanyInfo,
})

export const setSendCompanyImageData = (CompanyImage) => ({
  type: 'SEND_CompanyImage',
  payload: CompanyImage,
})

export const setSendPersonalImageData = (PersonalPhoto) => ({
  type: 'SEND_PersonalPhoto',
  payload: PersonalPhoto,
})

export const setSendProfileData = (ProfileInfo) => ({
  type: 'SEND_PROFILEINFO',
  payload: ProfileInfo,
})