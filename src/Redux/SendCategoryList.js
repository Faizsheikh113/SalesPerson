// reducer.js

const initialState = {
    CategoryList: null,
  };
  
  const HomeCategoryList = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_CategoryList':{
        // console.log(action)
        // debugger
        return {
          ...state,
          CategoryList: action.payload,
        };
      }
      default:
        return state;
    }
  };
  
  export default HomeCategoryList;