import * as channelContext from '../../../../contexts/channelContext/ChannelContext';
import * as chatContext from '../../../../contexts/chatContext/ChatContext';
import { useCooldown } from '../useCooldown';
import { act, renderHook } from '@testing-library/react-hooks';
import { ONE_SECOND_IN_MS } from '../../../../utils/date';
import { BuiltinRoles } from 'stream-chat';

const mockUserID = 'dipper-pines-123';
const mockCooldownSeconds = 10;

const mockUserChannelRole = '';
const mockUserClientRole = '';

jest.mock('../../../../contexts/channelContext/ChannelContext', () => ({
  useChannelContext: jest.fn(() => ({
    channel: {
      data: {
        cooldown: mockCooldownSeconds,
      },
      state: {
        members: {
          [mockUserID]: {
            role: mockUserChannelRole,
          },
        },
      },
    },
  })),
}));

jest.mock('../../../../contexts/chatContext/ChatContext', () => ({
  useChatContext: jest.fn(() => ({
    client: {
      user: {
        role: mockUserClientRole,
      },
      userID: mockUserID,
    },
  })),
}));

describe('useCooldown', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-09-13'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns the current date as the end date by default', () => {
    const { result } = renderHook(() => useCooldown());

    expect(result.current.endsAt.getTime()).toBe(Date.now());
  });

  it('can start a cooldown, by moving the end time', () => {
    const { result } = renderHook(() => useCooldown());

    // The end time should not have changed before calling start()
    expect(result.current.endsAt.getTime()).toBe(Date.now());

    act(() => {
      result.current.start();
    });

    // endsAt should be moved `cooldown` number of seconds into the future
    expect(result.current.endsAt.getTime()).toBe(
      Date.now() + mockCooldownSeconds * ONE_SECOND_IN_MS,
    );
  });

  describe('disabling cooldown for specific roles', () => {
    describe('role set locally for a channel', () => {
      it.each`
        role                             | shouldBeDisabled
        ${BuiltinRoles.Admin}            | ${true}
        ${BuiltinRoles.ChannelModerator} | ${true}
        ${BuiltinRoles.Anonymous}        | ${false}
        ${BuiltinRoles.Guest}            | ${false}
        ${BuiltinRoles.User}             | ${false}
      `('The role "$role" should be disabled: $shouldBeDisabled', ({ role, shouldBeDisabled }) => {
        mockChannelContextOnce({ role });
        const { result } = renderHook(() => useCooldown());

        // The end time should not have changed before calling start()
        expect(result.current.endsAt.getTime()).toBe(Date.now());
        act(() => {
          result.current.start();
        });

        const timeAfterStartWasCalled = result.current.endsAt.getTime();

        const hasChanged = timeAfterStartWasCalled !== Date.now();
        const shouldHaveChanged = !shouldBeDisabled;

        expect(hasChanged).toBe(shouldHaveChanged);
      });
    });

    describe('Role set globally on the client', () => {
      it.each`
        role                             | shouldBeDisabled
        ${BuiltinRoles.Admin}            | ${true}
        ${BuiltinRoles.ChannelModerator} | ${true}
        ${BuiltinRoles.Anonymous}        | ${false}
        ${BuiltinRoles.Guest}            | ${false}
        ${BuiltinRoles.User}             | ${false}
      `('The role "$role" should be disabled: $shouldBeDisabled', ({ role, shouldBeDisabled }) => {
        mockClientContextOnce({ role });
        const { result } = renderHook(() => useCooldown());

        // The end time should not have changed before calling start()
        expect(result.current.endsAt.getTime()).toBe(Date.now());
        act(() => {
          result.current.start();
        });

        const timeAfterStartWasCalled = result.current.endsAt.getTime();

        const hasChanged = timeAfterStartWasCalled !== Date.now();
        const shouldHaveChanged = !shouldBeDisabled;

        expect(hasChanged).toBe(shouldHaveChanged);
      });
    });
  });
});

/**
 * Helper functions to declutter tests
 */

const mockChannelContextOnce = ({
  cooldown = mockCooldownSeconds,
  userID = mockUserID,
  role = '',
}) =>
  (channelContext.useChannelContext as jest.Mock).mockReturnValueOnce({
    channel: {
      data: {
        cooldown,
      },
      state: {
        members: {
          [userID]: {
            role,
          },
        },
      },
    },
  });

const mockClientContextOnce = ({ userID = mockUserID, role = '' }) =>
  (chatContext.useChatContext as jest.Mock).mockReturnValueOnce({
    client: {
      user: {
        role,
      },
      userID,
    },
  });
