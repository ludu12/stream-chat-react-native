import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { useCountdown } from '../useCountdown';

const testId = 'countdown-text';
const TestComponent = ({ end }: { end: Date }) => {
  const { seconds } = useCountdown(end);

  return <Text testID={testId}>{seconds}</Text>;
};

describe('useCountdown', () => {
  it("returns zero seconds if it's given an end in the past", async () => {
    const { getByTestId } = render(<TestComponent end={new Date()} />);

    await waitFor(() => {
      expect(getByTestId(testId)).toBeTruthy();
    });
    expect(getByTestId(testId).props.children).toBe(0);
  });

  it('Counts down until given date', async () => {
    // This is set to .5 seconds longer than the time we test for to account for render time
    const { getByTestId } = render(<TestComponent end={new Date(Date.now() + 2500)} />);
    await waitFor(() => {
      expect(getByTestId(testId)).toBeTruthy();
    });
    await waitFor(() => {
      expect(getByTestId(testId).props.children).toBe(2);
    });
    await waitFor(() => {
      expect(getByTestId(testId).props.children).toBe(1);
    });
    await waitFor(() => {
      expect(getByTestId(testId).props.children).toBe(0);
    });
  });
});
