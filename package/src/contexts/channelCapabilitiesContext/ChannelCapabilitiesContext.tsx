import React, { PropsWithChildren, useContext } from 'react';

export const allChannelCapabilities = {
  banChannelMembers: 'ban-channel-members',
  deleteAnyMessage: 'delete-any-message',
  deleteOwnMessage: 'delete-own-message',
  flagMessage: 'flag-message',
  muteChannel: 'mute-channel',
  pinMessage: 'pin-message',
  quoteMessage: 'quote-message',
  readEvents: 'read-events',
  sendLinks: 'send-links',
  sendMessage: 'send-message',
  sendReaction: 'send-reaction',
  sendReply: 'send-reply',
  typingEvents: 'typing-events',
  updateAnyMessage: 'update-any-message',
  updateOwnMessage: 'update-own-message',
  uploadFile: 'upload-file',
};

export type ChannelCapability = keyof typeof allChannelCapabilities;

export type ChannelCapabilitiesContextValue = Record<ChannelCapability, boolean>;
export const ChannelCapabilitiesContext = React.createContext(
  {} as ChannelCapabilitiesContextValue,
);

export const ChannelCapabilitiesProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ChannelCapabilitiesContextValue;
}>) => (
  <ChannelCapabilitiesContext.Provider value={value as unknown as ChannelCapabilitiesContextValue}>
    {children}
  </ChannelCapabilitiesContext.Provider>
);

export const useChannelCapabilitiesContext = () =>
  useContext(ChannelCapabilitiesContext) as unknown as ChannelCapabilitiesContextValue;
