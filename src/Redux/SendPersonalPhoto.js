// reducer.js

const initialState = {
    PersonalPhoto: null,
    };
    
    const HomePersonalPhotoImage = (state = initialState, action) => {
      switch (action.type) {
        case 'SEND_PersonalPhoto':{
          console.log("PersonalPhoto 2222 @@@@ :- ",action)
          // debugger
          return {
            ...state,
            PersonalPhoto: action.payload,
          };
        }
        default:
          return state;
      }
    };
    
    export default HomePersonalPhotoImage;
    