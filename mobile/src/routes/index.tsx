import { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthContext from "../contexts/auth";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { Loading } from "../components/Loading";

// import { SignIn } from "../screens/SignIn";

export function Routes(){
    const { signed } = useContext(AuthContext);

    const [loading, setIsLoading] = useState(false); // Alterar para true o padrão
    // const [user, setUser] = useState<FirebaseAuthTypes.User>()

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(response => {
    //         setUser(response);
    //         setIsLoading(false);
    //     });

    //     return subscriber;

    // },[]);


    if(loading){
        return <Loading/>
    }

    return(
        <NavigationContainer>
            {/* {user ? <AppRoutes/> : <SignIn />} */}
            {signed ? <AppRoutes /> : <AuthRoutes/>}

        </NavigationContainer>
    )
}