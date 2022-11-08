import { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthContext from "../contexts/auth";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { Loading } from "../components/Loading";

export function Routes(){
    const { signed } = useContext(AuthContext);

    const [loading, setIsLoading] = useState(false); // Alterar para true o padrão
    
    if(loading){
        return <Loading/>
    }

    return(
        <NavigationContainer>
            {signed ? <AppRoutes /> : <AuthRoutes/>}

        </NavigationContainer>
    )
}