import { QueryClient, QueryClientProvider } from "react-query";
import { renderHook, act } from '@testing-library/react-hooks'
import mockConsole from "jest-mock-console";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { onDecrementSuccess, onIncrementSuccess } from "main/utils/playPageUtils";
import {cellToAxiosParamsDecrement} from "main/pages/PlayPage";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


describe("playPageUtils", () => {

    describe("onDecrementSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDecrementSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("onIncrementSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onIncrementSuccess("def");

            // assert
            expect(mockToast).toHaveBeenCalledWith("def");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("def");

            restoreConsole();
        });

    });
});

