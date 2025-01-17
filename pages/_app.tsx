import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { useState, createContext } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type Theme = "light" | "dark" | "system";

export interface UserContextProps {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

export const UserContext = createContext<UserContextProps>({
  theme: null,
  setTheme: () => {},
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [theme, setTheme] = useState(null);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);
  return (
    <>
      <UserContext.Provider value={{ theme, setTheme }}>
        {getLayout(<Component {...pageProps} />)}
      </UserContext.Provider>
    </>
  );
}
