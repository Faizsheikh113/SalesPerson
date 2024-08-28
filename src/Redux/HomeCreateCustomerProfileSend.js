// reducer.js

const initialState = {
    ProfileInfo: null,
  };
   const CreateCustomerProfileReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_PROFILEINFO':{
        console.log("Personal Info  :- ",action)
        // debugger
        return {
          ...state,
          ProfileInfo: action.payload,
        };
      }
      default:
        return state;
    }
  };

  export default CreateCustomerProfileReducer;
  