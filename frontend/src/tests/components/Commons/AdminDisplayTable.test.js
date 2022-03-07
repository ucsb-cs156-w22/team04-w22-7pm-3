
import { fireEvent, render, waitFor } from "@testing-library/react";
import  adminDisplayFixtures  from "fixtures/adminDisplayFixtures";
import AdminDisplayTable from "main/components/Commons/AdminDisplayTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


describe("AdminDsplayTable tests", () => {
  const queryClient = new QueryClient();
  
  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDisplayTable admins={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDisplayTable admins={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDisplayTable admins={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminDisplayTable admins={adminDisplayFixtures.threeAdmins} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["ID Number", "Milk Price", "Cow Price", "Commons Name", "Starting Balance", "Starting Date"];
    const expectedFields = ["id", "milk_price", "cow_price", "commons_name", "balance", "date" ];
    const testId = "AdminDisplayTable";

    expectedHeaders.forEach( (headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    } );

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("6");
    expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("1");
    expect(getByTestId(`${testId}-cell-row-0-col-commons_name`)).toHaveTextContent("UCSB");
    expect(getByTestId(`${testId}-cell-row-1-col-commons_name`)).toHaveTextContent("Isla Vista");
    expect(getByTestId(`${testId}-cell-row-2-col-commons_name`)).toHaveTextContent("Vicky");

  });
  
});

