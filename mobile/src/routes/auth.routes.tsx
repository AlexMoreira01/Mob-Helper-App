import React from "react";
import { SignIn } from "../screens/SignIn";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes(){
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="SignIn" component={SignIn}/>
        </Navigator>
    )
}