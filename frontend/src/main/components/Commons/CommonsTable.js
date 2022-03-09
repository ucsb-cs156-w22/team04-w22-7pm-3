import React from "react";
import OurTable from "main/components/OurTable";

export default function CommonsTable({ commons, currentUser }) {
    
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() => 
        [
            {
                Header: "ID Number",
                accessor: "id",
            },
            {
                Header: "Milk Price",
                accessor: "milkPrice",
            },
            {
                Header: "Cow Price",
                accessor: "cowPrice",
            },
            {
                Header: "Commons Name",
                accessor: "name",
            },
            {
                Header: "Starting Balance",
                accessor: "startingBalance",
            },
            {
                Header: "Starting Date",
                accessor: "startDate",
            }
            
        ], 
    );
    const memoizedDates = React.useMemo(() => commons);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"CommonsTable"}
    />;
};