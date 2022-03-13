
import { fireEvent, render, waitFor } from "@testing-library/react";
import  profitsFixtures  from "fixtures/profitsFixtures";
import ProfitsTable from "main/components/Commons/ProfitsTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


describe("CommonsTable tests", () => {
  const queryClient = new QueryClient();
  
  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={[]}/>
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("Has the expected column headers and content", () => {

 
    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={profitsFixtures.threeProfits} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Profit", "Date"];
    const expectedFields = ["profit", "time"];
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

