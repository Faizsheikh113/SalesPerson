// reducer.js

const initialState = {
    CompanyImage: null,
  };
  
  const HomeCompanyImage = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_CompanyImage':{
        console.log("ShopeImage 5555 :- ",action)
        // debugger
        return {
          ...state,
          CompanyImage: action.payload,
        };
      }
      default:
        return state;
    }
  };
  
  export default HomeCompanyImage;
  