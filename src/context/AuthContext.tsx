import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  // toda função async devolve uma promise
  singInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    // é uma boa prática sempre se descadastrar de um ouvidor de eventos
    // no final do useEffect
    return () => {
      unsubscribe();
    };
  }, []);

  async function singInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google account");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    /* todas as paginas terão acesso ao usuário logado e poderão realizar o login */
    <AuthContext.Provider value={{ user, singInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
