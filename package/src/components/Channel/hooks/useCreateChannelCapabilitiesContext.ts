import { useMemo } from 'react';

import {
  allChannelCapabilities,
  ChannelCapabilitiesContextValue,
  ChannelCapability,
} from '../../../contexts/channelCapabilitiesContext/ChannelCapabilitiesContext';
import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../../types/types';
import type { Channel } from 'stream-chat';

export const useCreateChannelCapabilitiesContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
>({
  channel,
  overrideCapabilities,
}: {
  channel: Channel<At, Ch, Co, Ev, Me, Re, Us>;
  overrideCapabilities?: Partial<ChannelCapabilitiesContextValue>;
}) => {
  const overrideCapabilitiesStr = overrideCapabilities
    ? JSON.stringify(Object.values(overrideCapabilities))
    : null;
  const ChannelCapabilitiesContext: ChannelCapabilitiesContextValue = useMemo(() => {
    const capabilities = (channel?.data?.own_capabilities || []) as Array<string>;
    const channelCapabilitiesContext = Object.keys(allChannelCapabilities).reduce(
      (result, capability) => ({
        ...result,
        [capability]:
          overrideCapabilities?.[capability as ChannelCapability] ??
          !!capabilities.includes(allChannelCapabilities[capability as ChannelCapability]),
      }),
      {} as ChannelCapabilitiesContextValue,
    );

    return channelCapabilitiesContext;
  }, [channel.id, overrideCapabilitiesStr]);

  return ChannelCapabilitiesContext;
};
