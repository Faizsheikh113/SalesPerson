import React from 'react';
import { Button, Linking } from 'react-native';

const OpenGoogleMap = ({ pastLocations }) => {
  const handleOpenMap = () => {
    if (pastLocations.length > 0) {
      const url = `https://www.google.com/maps/dir/${pastLocations.map(location => `${location.latitude},${location.longitude}`).join('/')}`;
      Linking.openURL(url);
    }
  };

  return <Button title="Open Google Maps" onPress={handleOpenMap} />;
};

export default OpenGoogleMap;



// import React from 'react';
// import { Button, Linking } from 'react-native';

// const OpenGoogleMap = () => {
//   const handleOpenMap = () => {
//     const latitude = YOUR_LATITUDE;
//     const longitude = YOUR_LONGITUDE;
//     const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
//     Linking.openURL(url);
//   };

//   return <Button title="Open Google Maps" onPress={handleOpenMap} />;
// };

// export default OpenGoogleMap;
