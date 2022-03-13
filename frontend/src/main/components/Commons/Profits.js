import React from "react";
import { Card } from "react-bootstrap";
import ProfitsTable from "main/components/Commons/ProfitsTable"
import { useBackend } from "main/utils/useBackend";



// add parameters 
const Profits = ({userCommons}) => {

    const { data: profitsData, error: profitsError, status: profitsStatus } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/profits/all/commons?userCommonsId=${userCommons}`],
      { method: "GET", url: `/api/profits/all/commons/`,
          params: {
              userCommonsId: userCommons?.id
          }
       },
       []
    );

    return (
        <Card>
            <Card.Header as="h5">Profits</Card.Header>
            <Card.Body>
                {/* change 4am to admin-appointed time? And consider adding milk bottle as decoration */}
                <Card.Title>You will earn profits from milking your cows everyday at 4am.</Card.Title>
                <ProfitsTable profits={profitsData} />
            </Card.Body>
        </Card>
    );
};

export default Profits;