// reducer.js

const initialState = {
    TransporterList: null,
  };
  
  const HomeTransporterList = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_TransporterList':{
        // console.log(action)
        // debugger
        return {
          ...state,
          TransporterList: action.payload,
        };
      }
      default:
        return state;
    }
  };
  
  export default HomeTransporterList;
  