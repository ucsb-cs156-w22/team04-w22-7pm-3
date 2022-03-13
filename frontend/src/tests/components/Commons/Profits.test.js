import { fireEvent, render, waitFor } from "@testing-library/react";
import Profits from "main/components/Commons/Profits"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures"; 
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import profitsFixtures from "fixtures/profitsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));


describe("Profits tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();



    test("renders without crashing", () => {

        axiosMock.onGet("/api/profits/all/commons/").reply(200, profitsFixtures.threeProfits);
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} />
                </MemoryRouter>
            </QueryClientProvider>
        );        
    });

    test("table is filled by dummy data", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = ["Profit", "Date" ];
        const expectedFields = ["profit", "time" ];
        const testId = "ProfitsTable";

        expectedHeaders.forEach( (headerText) => {
        const header = getByText(headerText);
        expect(header).toBeInTheDocument();
        } );

        expectedFields.forEach((field) => {
        const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-profit`)).toHaveTextContent(10);
        expect(getByTestId(`${testId}-cell-row-1-col-profit`)).toHaveTextContent(20);
        expect(getByTestId(`${testId}-cell-row-2-col-profit`)).toHaveTextContent(40);
        expect(getByTestId(`${testId}-cell-row-0-col-time`)).toHaveTextContent("2002-10-10T01:01:01");
        expect(getByTestId(`${testId}-cell-row-1-col-time`)).toHaveTextContent("2003-10-10T01:01:01");
        expect(getByTestId(`${testId}-cell-row-2-col-time`)).toHaveTextContent("2004-10-10T01:01:01");
        
    });

});