import { createContext, useState } from "react";
import { Alert } from "react-native";
import api from '../services/api'

export interface User {
    id: number;
    email: string;
    name: string;
    industry_code: string;
    isAdmin: boolean;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    signIn(email, password, setIsLoadingFalse): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    async function signIn(email, password, setIsLoadingFalse) {
    
        try{
            await api.post(`/login`, {
                email: email,
                password: password,
            })
            .then(res => {
                if(res.status === 200) {
                    setUser(res.data)
                }else {
                    return Alert.alert("Login", "Email ou senha incorretos!")
                }
            });
        } catch {
            setIsLoadingFalse();
            return Alert.alert("Login", "Email ou senha incorretos!")
        }
    }

    function signOut() {
        api.get(`/logout/${user.id}`);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;