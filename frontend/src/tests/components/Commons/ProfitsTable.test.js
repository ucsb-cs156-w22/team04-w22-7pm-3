
import { fireEvent, render, waitFor } from "@testing-library/react";
import  profitsFixtures  from "fixtures/profitsFixtures";
import ProfitsTable from "main/components/Commons/ProfitsTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


describe("ProfitsTable tests", () => {
  const queryClient = new QueryClient();
  
  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfitsTable profits={profitsFixtures.oneProfit} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Profit", "Date" ];
    const expectedFields = ["profit", "date" ];
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
    expect(getByTestId(`${testId}-cell-row-0-col-date`)).toHaveTextContent("06/11/2021");

  });
  
});