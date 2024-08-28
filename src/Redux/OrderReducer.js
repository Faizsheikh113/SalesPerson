// reducer.js

const initialState = {
    OrderArr: [],
  };
  
  const OrderReducer = (state = initialState, action) => {
    // console.log("AdminStaff Reducer ;- ",action);
    switch (action.type) {
      case 'Set_OrderArr':
        return {
          ...state,
          OrderArr: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default OrderReducer;
  