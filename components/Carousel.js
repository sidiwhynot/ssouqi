import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SliderBox } from 'react-native-image-slider-box'

const Carousel = () => {
    const images = [
        require("../assets/images/ecommerce-2.png"),
        require("../assets/images/ecommerce-1.jpg"),
        require("../assets/images/ecommerce-3.png"),
    ];
  return (
    <View>
      <SliderBox images={images}
      autoPlay circleLoop dotColor ={"#13274F"} inactiveDotColor="#90A4AE" ImageComponentStyle={{
        borderRadius:2,
        width:"100%",
      }}/>
    </View>
   )
}

export default Carousel

const styles = StyleSheet.create({})