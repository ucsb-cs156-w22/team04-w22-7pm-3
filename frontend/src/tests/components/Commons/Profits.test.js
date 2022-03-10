import { render } from "@testing-library/react";
import Profits from "main/components/Commons/Profits"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures"; 
import { MemoryRouter } from "react-router-dom";

describe("Profits tests", () => {

    test("renders without crashing", () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} />
        );
    });

    test("table is filled by dummy data", () => {
        const { getByText, getByTestId } = render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} />
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
        expect(getByTestId(`${testId}-cell-row-1-col-profit`)).toHaveTextContent(11);
        expect(getByTestId(`${testId}-cell-row-2-col-profit`)).toHaveTextContent(10);
        expect(getByTestId(`${testId}-cell-row-3-col-profit`)).toHaveTextContent(8);
        expect(getByTestId(`${testId}-cell-row-0-col-date`)).toHaveTextContent("2021-03-05");
        expect(getByTestId(`${testId}-cell-row-1-col-date`)).toHaveTextContent("2021-03-06");
        expect(getByTestId(`${testId}-cell-row-2-col-date`)).toHaveTextContent("2021-03-07");
        expect(getByTestId(`${testId}-cell-row-3-col-date`)).toHaveTextContent("2021-03-08");
    });

});