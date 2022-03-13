import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CommonsEditPage from "main/pages/CommonsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CommonsEditPage tests", () => {

    describe("when the backend doesn't return a common", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CommonsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Common")).toBeInTheDocument());
            expect(queryByTestId("CreateCommonsForm-name")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Anika's Commons",
                startDate: '2022-05-12',
                startingBalance: 1000,
                milkPrice: 10,
                cowPrice: 15,
            });
            axiosMock.onPut('/api/commons').reply(200, {
                id: 17,
                name: "Simon's Commons",
                startDate: '2022-06-12',
                startingBalance: 2000,
                milkPrice: 20,
                cowPrice: 200,
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CommonsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, getByLabelText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CommonsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CreateCommonsForm-name")).toBeInTheDocument());

            const idField = getByTestId("CreateCommonsForm-id");
            const nameField = getByTestId("CreateCommonsForm-name");
            const balanceField = getByTestId("CreateCommonsForm-startbal");
            const cowPriceField = getByTestId("CreateCommonsForm-cowprice");
            const milkPriceField = getByTestId("CreateCommonsForm-milkprice");
            const startDateField = getByTestId("CreateCommonsForm-startdate");
            
            const submitButton = getByTestId("CreateCommonsForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Anika's Commons");
            expect(balanceField).toHaveValue(1000);
            expect(cowPriceField).toHaveValue(15);
            expect(milkPriceField).toHaveValue(10);
            expect(startDateField).toHaveValue('2022-05-12');
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByLabelText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CommonsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CreateCommonsForm-name")).toBeInTheDocument());

            const idField = getByTestId("CreateCommonsForm-id");
            const nameField = getByTestId("CreateCommonsForm-name");
            const balanceField = getByTestId("CreateCommonsForm-startbal");
            const cowPriceField = getByTestId("CreateCommonsForm-cowprice");
            const milkPriceField = getByTestId("CreateCommonsForm-milkprice");
            const startDateField = getByTestId("CreateCommonsForm-startdate");
            const endDateField = getByLabelText("End Date");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Anika's Commons");
            expect(balanceField).toHaveValue(1000);
            expect(cowPriceField).toHaveValue(15);
            expect(milkPriceField).toHaveValue(10);
            expect(startDateField).toHaveValue('2022-05-12');

            const submitButton = getByTestId("CreateCommonsForm-submit");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: "Simon's Commons" } })
            fireEvent.change(balanceField, { target: { value: 2000 } })
            fireEvent.change(cowPriceField, { target: { value: 200 } })
            fireEvent.change(milkPriceField, { target: { value: 20 } })
            fireEvent.change(startDateField, { target: { value: '2022-06-12' } })
            fireEvent.change(endDateField, { target: { value: '2022-08-12' } })

            fireEvent.click(submitButton);

            await waitFor(() => { expect(mockToast).toBeCalledWith("Common Updated - id: 17 name: Simon's Commons"); });

            //expect(mockToast).toBeCalledWith("Common Updated - id: 17 name: Simon's Commons");
            expect(mockNavigate).toBeCalledWith({ "to": "/admin/listcommons" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                milkPrice: 20,
                name: "Simon's Commons",
                cowPrice: 200,
                startingBalance: 2000,
                startDate: '2022-06-12T00:00:00.000Z',  
            })); // posted object

        });

       
    });
});