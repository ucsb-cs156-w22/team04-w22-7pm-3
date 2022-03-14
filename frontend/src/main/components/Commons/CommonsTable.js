import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";

export default function CommonsTable({ commons, currentUser }) {
    
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const navigate = useNavigate();
    const editCallback = (cell) => {
        navigate(`/admin/commons/edit/${cell.row.values.id}`)
    }

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
            },
            {
                Header: "Ending Date",
                accessor: "endDate",
            }
            
        ], 
    );

    memoizedColumns.push(ButtonColumn("Edit", "primary", editCallback, "CommonsTable"));
    
    const memoizedDates = React.useMemo(() => commons);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"CommonsTable"}
    />;
};