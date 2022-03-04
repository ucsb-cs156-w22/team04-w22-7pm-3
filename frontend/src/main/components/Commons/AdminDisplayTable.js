import React from "react";
import OurTable from "main/components/OurTable";

export default function AdminDisplayTable({ admins }) {
    
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() => 
        [
            {
                Header: "ID Number",
                accessor: "id",
            },
            {
                Header: "Milk Price",
                accessor: "milk_price",
            },
            {
                Header: "Cow Price",
                accessor: "cow_price",
            },
            {
                Header: "Commons Name",
                accessor: "commons_name",
            },
            {
                Header: "Starting Balance",
                accessor: "balance",
            },
            {
                Header: "Starting Date",
                accessor: "date",
            }
        ], 
    []);
    const memoizedDates = React.useMemo(() => admins, [admins]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"AdminDisplayTable"}
    />;
};