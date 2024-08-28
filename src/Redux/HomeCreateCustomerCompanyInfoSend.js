
const initialState = {
    CompanyInfo: null,
  };
  
  const CreateCustomerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_COMPANYINFO':{
        // console.log("@@@@@@@",action)
        // debugger
        return {
          ...state,
          CompanyInfo: action.payload,
        };
      }
      default:
        return state;
    }
  };
  
  export default CreateCustomerReducer;