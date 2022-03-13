
import { fireEvent, render, waitFor } from "@testing-library/react";
import  commonsFixtures  from "fixtures/commonsFixtures";
import CommonsTable from "main/components/Commons/CommonsTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("CommonsTable tests", () => {
  const queryClient = new QueryClient();
  
  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  
  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={commonsFixtures.threeCommons} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["ID Number", "Milk Price", "Cow Price", "Commons Name", "Starting Balance", "Starting Date"];
    const expectedFields = ["id", "milkPrice", "cowPrice", "name", "startingBalance", "startDate" ];
    const testId = "CommonsTable";

    expectedHeaders.forEach( (headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    } );

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(5);
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(4);
    expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(1);
    expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Seths Common");
    expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Elizabeth's Commons");
    expect(getByTestId(`${testId}-cell-row-2-col-name`)).toHaveTextContent("Vicky's Commons");

  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const testId = "CommonsTable";

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={commonsFixtures.threeCommons} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(5); });

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/admin/commons/edit/5'));

  });

  
});

