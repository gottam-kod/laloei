import { View } from "react-native";
import { COLOR } from "../theme/token";

 const Divider = () => (
  <View
    style={{
      height: 1,
      backgroundColor: COLOR.accent,
      opacity: 0.8,
      marginVertical: 6,
    }}
  />
);
export default Divider;
