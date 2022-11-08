import React from "react";
import { SignIn } from "../screens/SignIn";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignUp } from "../screens/SignUp";

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes(){
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="SignIn" component={SignIn}/>
            {/* <Screen name="SignUp" component={SignUp}/> */}
        </Navigator>
    )
}