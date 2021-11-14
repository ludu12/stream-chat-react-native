import type { MessageActionType } from '../../MessageOverlay/MessageActionListItem';
import type { ChannelCapabilitiesContextValue } from '../../../contexts/channelCapabilitiesContext/ChannelCapabilitiesContext';
import type { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
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

export type MessageActionsParams<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
> = {
  blockUser: MessageActionType;
  channelCapabilities: ChannelCapabilitiesContextValue;
  copyMessage: MessageActionType;
  deleteMessage: MessageActionType;
  dismissOverlay: () => void;
  editMessage: MessageActionType;
  error: boolean | Error;
  flagMessage: MessageActionType;
  isThreadMessage: boolean;
  messageReactions: boolean;
  muteUser: MessageActionType;
  pinMessage: MessageActionType;
  quotedReply: MessageActionType;
  retry: MessageActionType;
  threadReply: MessageActionType;
  unpinMessage: MessageActionType;
} & Pick<MessageContextValue<At, Ch, Co, Ev, Me, Re, Us>, 'message' | 'isMyMessage'>;

export type MessageActionsProp<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
> = (param: MessageActionsParams<At, Ch, Co, Ev, Me, Re, Us>) => MessageActionType[];

export const messageActions = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
>({
  blockUser,
  channelCapabilities,
  copyMessage,
  deleteMessage,
  editMessage,
  error,
  flagMessage,
  isMyMessage,
  isThreadMessage,
  message,
  messageReactions,
  pinMessage,
  quotedReply,
  retry,
  threadReply,
  unpinMessage,
}: MessageActionsParams<At, Ch, Co, Ev, Me, Re, Us>) => {
  if (messageReactions) {
    return undefined;
  }

  const actions: Array<MessageActionType | null> = [];

  if (error && isMyMessage) {
    actions.push(retry);
  }

  if (channelCapabilities.quoteMessage && !isThreadMessage && !error) {
    actions.push(quotedReply);
  }

  if (channelCapabilities.sendReply && !isThreadMessage && !error) {
    actions.push(threadReply);
  }

  if (
    (isMyMessage && channelCapabilities.updateOwnMessage) ||
    (!isMyMessage && channelCapabilities.updateAnyMessage)
  ) {
    actions.push(editMessage);
  }

  if (message.text && !error) {
    actions.push(copyMessage);
  }

  if (!isMyMessage && channelCapabilities.flagMessage) {
    actions.push(flagMessage);
  }

  if (channelCapabilities.pinMessage && !message.pinned) {
    actions.push(pinMessage);
  }

  if (channelCapabilities.pinMessage && message.pinned) {
    actions.push(unpinMessage);
  }

  if (!isMyMessage && channelCapabilities.banChannelMembers) {
    actions.push(blockUser);
  }

  if (
    (isMyMessage && channelCapabilities.deleteOwnMessage) ||
    (!isMyMessage && channelCapabilities.deleteAnyMessage)
  ) {
    actions.push(deleteMessage);
  }

  return actions;
};
