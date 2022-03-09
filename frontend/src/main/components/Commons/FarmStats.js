import React from "react";
import { Card } from "react-bootstrap";

import cash from 'assets/Cash.png';
import health from 'assets/Health.png';

const FarmStats = ({userCommons}) => {
   
    return (
        <Card>
        <Card.Header as="h5">Your Farm Stats</Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                <img src={cash} alt="Cash" />
            </Card.Text>
            <Card.Text>
                Total Wealth: ${userCommons?.totalWealth}
            </Card.Text>
            <Card.Text>
                <img src={health} alt="Health" /> 
            </Card.Text>
            <Card.Text>
                Cow Health: {userCommons?.cowHealth}%
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 