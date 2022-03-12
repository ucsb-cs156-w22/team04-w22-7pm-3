import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockedNavigate(x); return null; }
    };
});


describe("AdminCreateCommonsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();


    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", async () => {

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateCommonsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByText("Create Commons")).toBeInTheDocument());

    });

    test("When you fill in form and click submit, the right things happens", async () => {

        axiosMock.onPost("/api/commons/new").reply(200, {
            "id": 5,
            "name": "Seths Common",
            "day": 5,
            "startDate": "6/11/2021",
            "endDate": "6/15/2021",
            "totalPlayers": 50,
            "cowPrice": 15,
        });

        const { getByText, getByLabelText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateCommonsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByText("Create Commons")).toBeInTheDocument());

        const commonsNameField = getByLabelText("Commons Name");
        const startingBalanceField = getByLabelText("Starting Balance");
        const cowPriceField = getByLabelText("Cow Price");
        const milkPriceField = getByLabelText("Milk Price");
        const startDateField = getByLabelText("Start Date");
        const endDateField = getByLabelText("End Date");
        const button = getByTestId("CreateCommonsForm-Create-Button");


        fireEvent.change(commonsNameField, { target: { value: 'My New Commons' } })
        fireEvent.change(startingBalanceField, { target: { value: '500' } })
        fireEvent.change(cowPriceField, { target: { value: '10' } })
        fireEvent.change(milkPriceField, { target: { value: '5' } })
        fireEvent.change(startDateField, { target: { value: '2022-05-12' } })
        fireEvent.change(endDateField, { target: { value: '2022-05-15' } })
        fireEvent.click(button);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        const expectedCommons = {
            name: "My New Commons",
            startingBalance: 500,
            cowPrice: 10,
            milkPrice: 5,
            startDate: '2022-05-12T00:00:00.000Z',
            endDate: '2022-05-15T00:00:00.000Z'
        };

        expect(axiosMock.history.post[0].data).toEqual( JSON.stringify(expectedCommons) );
    });

});
