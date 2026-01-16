import { useAuth } from './AuthContext';
import { ChatProvider } from './ChatContext'

export const ChatProviderWithAuthKey = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <ChatProvider key={auth?.user?.email ?? "guest"}>
      {children}
    </ChatProvider>
  );
};


/*
    This is a bridge component because we can't use the auth at the same level where the provider is present
    so just to nest it down this bridge component is made this resolves the manual setting of chat state 
    every time user logs out because that doesn't sync up with the lifecycle also component was 
    not auto rerendering hence it was taking a manaul refresh to clear chats when user logs out 
    but this kills this purpose of manaully doing setChatsMessage([]) perfectly
*/