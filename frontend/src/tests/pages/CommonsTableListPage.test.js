import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CommonsTableListPage from "main/pages/CommonsTableListPage";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { commonsFixtures } from "fixtures/commonsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

describe("CommonsTableListPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "CommonsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    }

    test("renders without crashing", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CommonsTableListPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three commons without crashing", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CommonsTableListPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4")
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("1");
    });

    test("renders empty table when backend unavailable", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CommonsTableListPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/commons/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });


});