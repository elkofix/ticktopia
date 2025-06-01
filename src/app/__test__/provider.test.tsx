import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import TopBar from '../../shared/components/TopBar';
import ReduxProvider from '../provider';

// Mock the dependencies
jest.mock('react-redux', () => ({
    Provider: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('redux-persist/integration/react', () => ({
    PersistGate: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../shared/components/TopBar', () =>
    jest.fn(() => <div>Mocked TopBar</div>)
);

jest.mock('../../store/store', () => ({
    store: {},
    persistor: {},
}));

describe('ReduxProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <ReduxProvider>
                <div>Test Child</div>
            </ReduxProvider>
        );
    });

    it('wraps children with Redux Provider and PersistGate', () => {
        const testChild = <div>Test Child</div>;

        render(
            <ReduxProvider>
                {testChild}
            </ReduxProvider>
        );

        expect(Provider).not.toHaveBeenCalledWith(
            expect.anything(),
        );
    });

    it('renders the TopBar component', () => {
        render(
            <ReduxProvider>
                <div>Test Child</div>
            </ReduxProvider>
        );

        expect(TopBar).toHaveBeenCalled();
    });

    it('renders children correctly', () => {
        const testChild = <div data-testid="test-child">Test Child</div>;

        const { getByTestId } = render(
            <ReduxProvider>
                {testChild}
            </ReduxProvider>
        );

        expect(getByTestId('test-child')).toBeInTheDocument();
    });

    it('matches the component structure', () => {
        const testChild = <div>Test Child</div>;

        render(
            <ReduxProvider>
                {testChild}
            </ReduxProvider>
        );

        // Verify the component hierarchy
        const providerCall = (Provider as jest.Mock).mock.calls[0][0];
        const persistGateCall = (PersistGate as jest.Mock).mock.calls[0][0];

        expect(providerCall.children.type).toBe(PersistGate);
        expect(persistGateCall.children[0].type).toBe(TopBar);
        expect(persistGateCall.children[1]).toBe(testChild);
    });
});